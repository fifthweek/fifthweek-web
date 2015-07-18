describe('fw-update-payment-information-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var stripeService;
  var paymentsStub;
  var fetchAggregateUserState;
  var fwUpdatePaymentInformationConstants;
  var errorFacade;
  var authenticationService;
  var authenticationServiceConstants;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['reload']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'getUserId']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    stripeService = jasmine.createSpyObj('stripeService', ['createToken']);
    paymentsStub = jasmine.createSpyObj('paymentsStub', ['getCreditRequestSummary', 'putPaymentOrigin', 'postCreditRequest']);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateFromServer']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    authenticationService = {};

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('stripeService', stripeService);
      $provide.value('paymentsStub', paymentsStub);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('errorFacade', errorFacade);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      fwUpdatePaymentInformationConstants = $injector.get('fwUpdatePaymentInformationConstants');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    accountSettingsRepository.getUserId.and.returnValue('userId');
    inject(function ($controller) {
      target = $controller('fwUpdatePaymentInformationCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set isLoaded to false', function(){
      expect($scope.model.isLoaded).toBe(false);
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set success to be false', function(){
      expect($scope.model.success).toBe(false);
    });

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should set the userId', function(){
      expect($scope.model.userId).toBe('userId');
    });

    it('should set the mode to paymentInformation', function(){
      expect($scope.model.mode).toBe(fwUpdatePaymentInformationConstants.modes.paymentInformation);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when resetForm is called', function(){
      beforeEach(function(){
        $scope.model.input.creditCardNumber = 'creditCardNumber';
        $scope.model.input.expiry = 'expiry';
        $scope.model.input.cvc = 'cvc';
        $scope.model.creditRequestSummary = 'creditRequestSummary';
        target.internal.token = 'token';
        target.internal.paymentOrigin = 'paymentOrigin';
        $scope.model.mode = 'mode';

        target.internal.resetForm();
      });

      it('should reset input data', function(){
        expect($scope.model.input.creditCardNumber).toBe('');
        expect($scope.model.input.expiry).toBe('');
        expect($scope.model.input.cvc).toBe('');
      });

      it('should reset creditRequestSummary', function(){
        expect($scope.model.creditRequestSummary).toBeUndefined();
      });

      it('should reset token', function(){
        expect(target.internal.token).toBeUndefined();
      });

      it('should reset paymentOrigin', function(){
        expect(target.internal.paymentOrigin).toBeUndefined();
      });

      it('shoudl set the mode to paymentInformation', function(){
        expect($scope.model.mode).toBe(fwUpdatePaymentInformationConstants.modes.paymentInformation);
      });
    });

    describe('when createFailedToDetermineCountryError is called', function(){
      var result;
      beforeEach(function(){
        target.internal.paymentOrigin = {
          countryCode: 'countryCode',
          creditCardPrefix: 'creditCardPrefix',
          ipAddress: 'ipAddress'
        };

        result = target.internal.createFailedToDetermineCountryError();
      });

      it('should return a FifthweekError', function(){
        expect(result instanceof FifthweekError).toBe(true);
      });

      it('should contain the country code', function(){
        expect(result.message.indexOf('countryCode') !== -1).toBe(true);
      });

      it('should contain the credit card prefix', function(){
        expect(result.message.indexOf('creditCardPrefix') !== -1).toBe(true);
      });

      it('should contain the ip address', function(){
        expect(result.message.indexOf('ipAddress') !== -1).toBe(true);
      });

      it('should contain the user id', function(){
        expect(result.message.indexOf('userId') !== -1).toBe(true);
      });
    });

    describe('when getCreditRequestSummary is called', function(){
      var success;
      var error;
      var deferredGetCreditRequestSummary;
      var deferredUpdatePaymentInformationWithoutCharge;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredGetCreditRequestSummary = $q.defer();
        paymentsStub.getCreditRequestSummary.and.returnValue(deferredGetCreditRequestSummary.promise);

        deferredUpdatePaymentInformationWithoutCharge = $q.defer();
        spyOn(target.internal, 'updatePaymentInformationWithoutCharge').and.returnValue(deferredUpdatePaymentInformationWithoutCharge.promise);

        target.internal.token = {
          id: 'tokenId',
          client_ip: 'ipAddress'
        };
        $scope.model.input.creditCardNumber = '1234567890';
      });

      var testWhenGetCeditRequestSummarySucceedsWithCountryName = function(){

        describe('when getCreditRequestSummary succeeds with country name and requires charge', function(){
          var response;
          beforeEach(function(){
            response = { data: { calculation: { countryName: 'countryName' }}};

            spyOn(target.internal, 'requiresCharge').and.returnValue(true);

            deferredGetCreditRequestSummary.resolve(response);
            $scope.$apply();
          });

          it('should set the creditRequestSummary', function(){
            expect($scope.model.creditRequestSummary).toBe(response.data);
          });

          it('should set the mode to transactionVerification', function(){
            expect($scope.model.mode).toBe(fwUpdatePaymentInformationConstants.modes.transactionVerification);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getCreditRequestSummary succeeds with country name and does not require charge', function(){
          var response;
          beforeEach(function(){
            response = { data: { calculation: { countryName: 'countryName' }}};

            spyOn(target.internal, 'requiresCharge').and.returnValue(false);

            deferredGetCreditRequestSummary.resolve(response);
            $scope.$apply();
          });

          it('should not set the creditRequestSummary', function(){
            expect($scope.model.creditRequestSummary).toBeUndefined();
          });

          it('should call updatePaymentInformationWithoutCharge', function(){
            expect(target.internal.updatePaymentInformationWithoutCharge).toHaveBeenCalledWith();
          });

          describe('when updatePaymentInformationWithoutCharge succeeds', function(){
            beforeEach(function(){
              deferredUpdatePaymentInformationWithoutCharge.resolve();
              $scope.$apply();
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when updatePaymentInformationWithoutCharge fails', function(){
            beforeEach(function(){
              deferredUpdatePaymentInformationWithoutCharge.reject('error');
              $scope.$apply();
            });

            it('should propagate the error', function(){
              expect(error).toBe('error');
            });
          });
        });

      };

      describe('when country code is supplied', function(){
        beforeEach(function(){
          target.internal.getCreditRequestSummary('countryCode').then(function(){ success = true; }, function(e) { error = e; });
          $scope.$apply();
        });

        it('should set the paymentOrigin', function(){
          expect(target.internal.paymentOrigin).toEqual({
            stripeToken: 'tokenId',
            countryCode: 'countryCode',
            creditCardPrefix: '123456',
            ipAddress: 'ipAddress'
          });
        });

        it('should call getCreditRequestSummary', function(){
          expect(paymentsStub.getCreditRequestSummary).toHaveBeenCalledWith(
            'userId', 'countryCode', '123456', 'ipAddress');
        });

        testWhenGetCeditRequestSummarySucceedsWithCountryName();

        describe('when getCreditRequestSummary succeeds without country name', function(){
          var response;
          beforeEach(function(){
            spyOn(target.internal, 'createFailedToDetermineCountryError').and.returnValue('error');

            response = { data: { calculation: { countryName: undefined }}};
            deferredGetCreditRequestSummary.resolve(response);
            $scope.$apply();
          });

          it('should not set the creditRequestSummary', function(){
            expect($scope.model.creditRequestSummary).toBeUndefined();
          });

          it('should call createFailedToDetermineCountryError', function(){
            expect(target.internal.createFailedToDetermineCountryError).toHaveBeenCalledWith();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });

        describe('when getCreditRequestSummary fails', function(){
          beforeEach(function(){
            deferredGetCreditRequestSummary.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when country code is not supplied', function(){
        beforeEach(function(){
          target.internal.getCreditRequestSummary(undefined).then(function(){ success = true; }, function(e) { error = e; });
          $scope.$apply();
        });

        it('should set the paymentOrigin', function(){
          expect(target.internal.paymentOrigin).toEqual({
            stripeToken: 'tokenId',
            countryCode: undefined,
            creditCardPrefix: '123456',
            ipAddress: 'ipAddress'
          });
        });

        it('should call getCreditRequestSummary', function(){
          expect(paymentsStub.getCreditRequestSummary).toHaveBeenCalledWith(
            'userId', undefined, '123456', 'ipAddress');
        });

        testWhenGetCeditRequestSummarySucceedsWithCountryName();

        describe('when getCreditRequestSummary succeeds without country name', function(){
          var response;
          beforeEach(function(){
            response = { data: { calculation: { countryName: undefined }}};
            deferredGetCreditRequestSummary.resolve(response);
            $scope.$apply();
          });

          it('should set the creditRequestSummary', function(){
            expect($scope.model.creditRequestSummary).toBe(response.data);
          });

          it('should set the mode to countryVerification', function(){
            expect($scope.model.mode).toBe(fwUpdatePaymentInformationConstants.modes.countryVerification);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getCreditRequestSummary fails', function(){
          beforeEach(function(){
            deferredGetCreditRequestSummary.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('when handleError is called', function(){
      var success;
      var error;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        spyOn(target.internal, 'resetForm');
        $scope.model.errorMessage = undefined;

        target.internal.handleError('error');
        $scope.$apply();
      });

      it('should call resetForm', function(){
        expect(target.internal.resetForm).toHaveBeenCalledWith();
      });

      it('should set the error message', function(){
        expect($scope.model.errorMessage).toBe('friendlyError');
      });
    });

    describe('when stripeResponseHandler is called', function(){
      var success;
      var error;
      var deferredGetCreditRequestSummary;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        spyOn(target.internal, 'handleError');

        deferredGetCreditRequestSummary = $q.defer();
        spyOn(target.internal, 'getCreditRequestSummary').and.returnValue(deferredGetCreditRequestSummary.promise);
      });

      describe('when the response contains an error', function(){
        beforeEach(function(){
          target.internal.stripeResponseHandler('status', { error: { message: 'message' }, id: 'id' }).then(function(){ success = true; }, function(e) { error = e; });
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('message');
        });
      });

      describe('when the response is successful', function(){
        var response;
        beforeEach(function(){
          response = { error: undefined, id: 'id' };
          target.internal.stripeResponseHandler('status', response).then(function(){ success = true; }, function(e) { error = e; });
          $scope.$apply();
        });

        it('should call getCreditRequestSummary', function(){
          expect(target.internal.getCreditRequestSummary).toHaveBeenCalledWith(undefined);
        });

        it('should set the token', function(){
          expect(target.internal.token).toBe(response);
        });

        describe('when getCreditRequestSummary succeeds', function(){
          beforeEach(function(){
            deferredGetCreditRequestSummary.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getCreditRequestSummary fails', function(){
          beforeEach(function(){
            deferredGetCreditRequestSummary.reject('error');
            $scope.$apply();
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should call handleError', function(){
            expect(target.internal.handleError).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when isStandardUser is called', function(){
      describe('when user is standard user', function(){
        var result;
        beforeEach(function(){
          authenticationService.currentUser = {
            roles: [
              'role1',
              'role2'
            ]
          };

          result = target.internal.isStandardUser();
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });
      });

      describe('when user is test user', function(){
        var result;
        beforeEach(function(){
          authenticationService.currentUser = {
            roles: [
              'role1',
              authenticationServiceConstants.roles.testUser,
              'role2'
            ]
          };

          result = target.internal.isStandardUser();
        });

        it('should return false', function(){
          expect(result).toBe(false);
        });
      });
    });

    describe('when confirmCountry is called', function(){
      var success;
      var error;
      var deferredGetCreditRequestSummary;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        spyOn(target.internal, 'handleError');

        deferredGetCreditRequestSummary = $q.defer();
        spyOn(target.internal, 'getCreditRequestSummary').and.returnValue(deferredGetCreditRequestSummary.promise);

        $scope.confirmCountry('countryCode').then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should call getCreditRequestSummary', function(){
        expect(target.internal.getCreditRequestSummary).toHaveBeenCalledWith('countryCode');
      });

      describe('when getCreditRequestSummary succeeds', function(){
        beforeEach(function(){
          deferredGetCreditRequestSummary.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when getCreditRequestSummary fails', function(){
        beforeEach(function(){
          deferredGetCreditRequestSummary.reject('error');
          $scope.$apply();
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should call handleError', function(){
          expect(target.internal.handleError).toHaveBeenCalled();
        });
      });
    });

    describe('when failConfirmCountry is called', function(){
      beforeEach(function(){
        $scope.model.mode = 'mode';
        $scope.failConfirmCountry();
        $scope.$apply();
      });

      it('should set the mode to countryFailure', function(){
        expect($scope.model.mode).toBe(fwUpdatePaymentInformationConstants.modes.countryFailure);
      });
    });

    describe('when updatePaymentInformationWithoutCharge is called', function(){
      var success;
      var error;
      var deferredPutPaymentOrigin;
      var deferredUpdateFromServer;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredPutPaymentOrigin = $q.defer();
        paymentsStub.putPaymentOrigin.and.returnValue(deferredPutPaymentOrigin.promise);

        deferredUpdateFromServer = $q.defer();
        fetchAggregateUserState.updateFromServer.and.returnValue(deferredUpdateFromServer.promise);

        target.internal.paymentOrigin = 'paymentOrigin';
        $scope.model.success = false;
        spyOn(target.internal, 'resetForm');

        target.internal.updatePaymentInformationWithoutCharge().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should call putPaymentOrigin', function(){
        expect(paymentsStub.putPaymentOrigin).toHaveBeenCalledWith('userId', 'paymentOrigin');
      });

      describe('when putPaymentOrigin succeeds', function(){
        beforeEach(function(){
          $scope.model.creditRequestSummary = {
            calculation: {
              amount: 'amount',
              totalAmount: 'totalAmount'
            }
          };

          deferredPutPaymentOrigin.resolve();
          $scope.$apply();
        });

        it('should set success to true', function(){
          expect($scope.model.success).toBe(true);
        });

        it('should call resetForm', function(){
          expect(target.internal.resetForm).toHaveBeenCalledWith();
        });

        it('should call updateFromServer', function(){
          expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith('userId');
        });

        describe('when updateFromServer succeeds', function(){
          beforeEach(function(){
            deferredUpdateFromServer.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when updateFromServer fails', function(){
          beforeEach(function(){
            deferredUpdateFromServer.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when putPaymentOrigin fails', function(){
        beforeEach(function(){
          deferredPutPaymentOrigin.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when confirmTransaction is called', function(){
      var success;
      var error;
      var deferredPutPaymentOrigin;
      var deferredPostCreditRequest;
      var deferredUpdateFromServer;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        spyOn(target.internal, 'handleError');

        deferredPutPaymentOrigin = $q.defer();
        paymentsStub.putPaymentOrigin.and.returnValue(deferredPutPaymentOrigin.promise);

        deferredPostCreditRequest = $q.defer();
        paymentsStub.postCreditRequest.and.returnValue(deferredPostCreditRequest.promise);

        deferredUpdateFromServer = $q.defer();
        fetchAggregateUserState.updateFromServer.and.returnValue(deferredUpdateFromServer.promise);

        target.internal.paymentOrigin = 'paymentOrigin';
        $scope.confirmTransaction().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should call putPaymentOrigin', function(){
        expect(paymentsStub.putPaymentOrigin).toHaveBeenCalledWith('userId', 'paymentOrigin');
      });

      describe('when putPaymentOrigin succeeds', function(){
        beforeEach(function(){
          $scope.model.creditRequestSummary = {
            calculation: {
              amount: 'amount',
              totalAmount: 'totalAmount'
            }
          };

          deferredPutPaymentOrigin.resolve();
          $scope.$apply();
        });

        it('should call postCreditRequest', function(){
          expect(paymentsStub.postCreditRequest).toHaveBeenCalledWith('userId', { amount: 'amount', expectedTotalAmount: 'totalAmount' });
        });

        describe('when postCreditRequest succeeds', function() {
          beforeEach(function(){
            deferredPostCreditRequest.resolve();
            $scope.$apply();
          });

          it('should call updateFromServer', function(){
            expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith('userId');
          });

          describe('when updateFromServer succeeds', function(){
            beforeEach(function(){
              deferredUpdateFromServer.resolve();
              $scope.$apply();
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when updateFromServer fails', function(){
            beforeEach(function(){
              deferredUpdateFromServer.reject('error');
              $scope.$apply();
            });

            it('should not propagate the error', function(){
              expect(error).toBeUndefined();
            });

            it('should call handleError', function(){
              expect(target.internal.handleError).toHaveBeenCalled();
            });
          });
        });

        describe('when postCreditRequest fails', function(){
          beforeEach(function(){
            deferredPostCreditRequest.reject('error');
            $scope.$apply();
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should call handleError', function(){
            expect(target.internal.handleError).toHaveBeenCalled();
          });
        });
      });

      describe('when putPaymentOrigin fails', function(){
        beforeEach(function(){
          deferredPutPaymentOrigin.reject('error');
          $scope.$apply();
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should call handleError', function(){
          expect(target.internal.handleError).toHaveBeenCalled();
        });
      });
    });

    describe('when cancel is called', function(){
      beforeEach(function(){
        $scope.cancel();
        $scope.$apply();
      });

      it('should call $state.reload', function(){
        expect($state.reload).toHaveBeenCalledWith();
      });
    });

    describe('when submit is called', function(){
      var success;
      var error;
      var deferredCreateToken;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredCreateToken = $q.defer();
        stripeService.createToken.and.returnValue(deferredCreateToken.promise);

        spyOn(target.internal, 'isStandardUser').and.returnValue('isStandardUser');
        spyOn(target.internal, 'handleError');

        $scope.model.success = true;
        $scope.model.input.expiry = '12/34';
        $scope.model.input.creditCardNumber = 'ccn';
        $scope.model.input.cvc = 'cvc';

        $scope.submit().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should set success to false', function(){
        expect($scope.model.success).toBe(false);
      });

      it('should call isStandardUser', function(){
        expect(target.internal.isStandardUser).toHaveBeenCalledWith();
      });

      it('should call createToken', function(){
        expect(stripeService.createToken).toHaveBeenCalledWith(
          'isStandardUser',
          'ccn',
          'cvc',
          '12',
          '34',
          target.internal.stripeResponseHandler);
      });

      describe('when createToken succeeds', function(){
        beforeEach(function(){
          deferredCreateToken.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when createToken fails', function(){
        beforeEach(function(){
          deferredCreateToken.reject('error');
          $scope.$apply();
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should call handleError', function(){
          expect(target.internal.handleError).toHaveBeenCalled();
        });
      });
    });

    describe('when initialize is called', function(){
      var success;
      var error;
      var deferredGetAccountSettings;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredGetAccountSettings = $q.defer();
        accountSettingsRepository.getAccountSettings.and.returnValue(deferredGetAccountSettings.promise);

        target.initialize().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should call getAccountSettings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
      });

      describe('when getAccountSettings succeeds', function(){
        describe('when paymentStatus is failed', function(){
          beforeEach(function(){
            deferredGetAccountSettings.resolve({
              hasPaymentInformation: 'hasPaymentInformation',
              paymentStatus: 'Failed',
              email: 'email',
              accountBalance: 'accountBalance'
            });
            $scope.$apply();
          });

          it('should set hasPaymentInformation', function(){
            expect($scope.model.hasPaymentInformation).toBe('hasPaymentInformation');
          });

          it('should set email', function(){
            expect($scope.model.email).toBe('email');
          });

          it('should set hasPaymentFailed to true', function(){
            expect($scope.model.hasPaymentFailed).toBe(true);
          });

          it('should set accountBalance', function(){
            expect($scope.model.accountBalance).toBe('accountBalance');
          });

          it('should set isLoaded to true', function(){
            expect($scope.model.isLoaded).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when paymentStatus is not failed', function(){
          beforeEach(function(){
            deferredGetAccountSettings.resolve({
              hasPaymentInformation: 'hasPaymentInformation',
              paymentStatus: 'Retry1',
              email: 'email'
            });
            $scope.$apply();
          });

          it('should set hasPaymentInformation', function(){
            expect($scope.model.hasPaymentInformation).toBe('hasPaymentInformation');
          });

          it('should set email', function(){
            expect($scope.model.email).toBe('email');
          });

          it('should set hasPaymentFailed to false', function(){
            expect($scope.model.hasPaymentFailed).toBe(false);
          });

          it('should set isLoaded to true', function(){
            expect($scope.model.isLoaded).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });

      describe('when getAccountSettings fails', function(){
        beforeEach(function(){
          deferredGetAccountSettings.reject('error');
          $scope.$apply();
        });

        it('should set isLoaded to true', function(){
          expect($scope.model.isLoaded).toBe(true);
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});
