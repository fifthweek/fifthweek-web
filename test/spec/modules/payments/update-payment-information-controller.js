describe('update-payment-information-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var initializer;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var paymentsStub;
  var fetchAggregateUserState;
  var aggregateUserStateConstants;
  var errorFacade;

  beforeEach(function() {
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'getUserId']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    paymentsStub = jasmine.createSpyObj('paymentsStub', ['deletePaymentInformation']);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateFromServer']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    module('webApp');
    module(function($provide) {
      $provide.value('initializer', initializer);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('paymentsStub', paymentsStub);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    accountSettingsRepository.getUserId.and.returnValue('userId');
    inject(function ($controller) {
      target = $controller('updatePaymentInformationCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set hasPaymentInformation to be true', function(){
      expect($scope.model.hasPaymentInformation).toBe(true);
    });

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should set the userId', function(){
      expect($scope.model.userId).toBe('userId');
    });

    it('should call initialize', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when loadForm is called', function(){
      var success;
      var error;
      var deferredGetAccountSettings;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredGetAccountSettings = $q.defer();
        accountSettingsRepository.getAccountSettings.and.returnValue(deferredGetAccountSettings.promise);

        $scope.model.hasPaymentInformation = 'hasPaymentInformation';

        target.internal.loadForm().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call getAccountSettings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
      });

      describe('when getAccountSettings succeeds', function(){
        beforeEach(function(){
          deferredGetAccountSettings.resolve({ hasPaymentInformation: false });
          $scope.$apply();
        });

        it('should set hasPaymentInformation', function(){
          expect($scope.model.hasPaymentInformation).toBe(false);
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when getAccountSettings fails', function(){
        beforeEach(function(){
          deferredGetAccountSettings.reject('error');
          $scope.$apply();
        });

        it('should set hasPaymentInformation to true', function(){
          expect($scope.model.hasPaymentInformation).toBe(true);
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });
      });
    });

    describe('when deletePaymentInformation is called', function(){
      var success;
      var error;
      var deferredDeletePaymentInformation;
      var deferredUpdateFromServer;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredDeletePaymentInformation = $q.defer();
        paymentsStub.deletePaymentInformation.and.returnValue(deferredDeletePaymentInformation.promise);

        deferredUpdateFromServer = $q.defer();
        fetchAggregateUserState.updateFromServer.and.returnValue(deferredUpdateFromServer.promise);

        $scope.model.hasPaymentInformation = 'hasPaymentInformation';

        $scope.deletePaymentInformation().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call deletePaymentInformation', function(){
        expect(paymentsStub.deletePaymentInformation).toHaveBeenCalledWith('userId');
      });

      describe('when deletePaymentInformation succeeds', function(){
        beforeEach(function(){
          deferredDeletePaymentInformation.resolve();
          $scope.$apply();
        });

        it('should call updateFromServer', function(){
          expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith('userId');
        });

        describe('when updateFromServer succeeds', function(){
          beforeEach(function(){
            deferredUpdateFromServer.resolve({ hasPaymentInformation: false });
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

          it('should set hasPaymentInformation to true', function(){
            expect($scope.model.hasPaymentInformation).toBe(true);
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });
        });
      });

      describe('when deletePaymentInformation fails', function(){
        beforeEach(function(){
          deferredDeletePaymentInformation.reject('error');
          $scope.$apply();
        });

        it('should set hasPaymentInformation to true', function(){
          expect($scope.model.hasPaymentInformation).toBe(true);
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });
      });
    });

    describe('when calling initialize', function(){
      var success;
      var error;
      var deferredLoadForm;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLoadForm = $q.defer();
        spyOn(target.internal, 'loadForm').and.returnValue(deferredLoadForm.promise);

        spyOn($scope, '$on');

        target.internal.initialize().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should attach to the user state updated event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.loadForm);
      });

      it('should call loadForm', function(){
        expect(target.internal.loadForm).toHaveBeenCalledWith();
      });

      describe('when loadForm succeeds', function(){
        beforeEach(function(){
          deferredLoadForm.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when loadForm fails', function(){
        beforeEach(function(){
          deferredLoadForm.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});
