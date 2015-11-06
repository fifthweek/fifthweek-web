describe('fw-account-balance-warning-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var aggregateUserStateConstants;
  var errorFacade;

  beforeEach(function() {

    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['getBlogs', 'tryGetBlogs']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'tryGetAccountSettings']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    errorFacade.handleError.and.callFake(function(error, delegate){ delegate('friendlyError'); });

    module('webApp');
    module(function($provide) {
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwAccountBalanceWarningCtrl', { $scope: $scope });
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

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when updateModel is called', function(){
      describe('when no account settings and no blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(undefined, undefined);
        });

        it('should set accountBalance', function(){
          expect($scope.model.accountBalance).toBe(0);
        });

        it('should set isRetryingPayment', function(){
          expect($scope.model.isRetryingPayment).toBe(false);
        });

        it('should set hasPaymentInformation', function(){
          expect($scope.model.hasPaymentInformation).toBe(false);
        });

        it('should set paymentFailed to false', function(){
          expect($scope.model.paymentFailed).toBe(false);
        });

        it('should set hasFreeAccessBlogs to false', function(){
          expect($scope.model.hasFreeAccessBlogs).toBe(false);
        });

        it('should set hasPaidBlogs to false', function(){
          expect($scope.model.hasPaidBlogs).toBe(false);
        });

        it('should set displayingAccountBalanceWarning to false', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(false);
        });
      });

      describe('when payment status is not failed and no blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 'accountBalance',
              isRetryingPayment: 'isRetryingPayment',
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            []);
        });

        it('should set accountBalance', function(){
          expect($scope.model.accountBalance).toBe('accountBalance');
        });

        it('should set isRetryingPayment', function(){
          expect($scope.model.isRetryingPayment).toBe('isRetryingPayment');
        });

        it('should set hasPaymentInformation', function(){
          expect($scope.model.hasPaymentInformation).toBe('hasPaymentInformation');
        });

        it('should set paymentFailed to false', function(){
          expect($scope.model.paymentFailed).toBe(false);
        });

        it('should set hasFreeAccessBlogs to false', function(){
          expect($scope.model.hasFreeAccessBlogs).toBe(false);
        });

        it('should set hasPaidBlogs to false', function(){
          expect($scope.model.hasPaidBlogs).toBe(false);
        });

        it('should set displayingAccountBalanceWarning to false', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(false);
        });
      });

      describe('when payment status is not failed', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 'accountBalance',
              isRetryingPayment: 'isRetryingPayment',
              paymentStatus: 'Failed',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            []);
        });

        it('should set paymentFailed to true', function(){
          expect($scope.model.paymentFailed).toBe(true);
        });
      });

      describe('when free access blog exists', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 'accountBalance',
              isRetryingPayment: 'isRetryingPayment',
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: true
              }
            ]);
        });

        it('should set hasFreeAccessBlogs to true', function(){
          expect($scope.model.hasFreeAccessBlogs).toBe(true);
        });

        it('should set hasPaidBlogs to false', function(){
          expect($scope.model.hasPaidBlogs).toBe(false);
        });
      });

      describe('when paid blog exists', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 'accountBalance',
              isRetryingPayment: 'isRetryingPayment',
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: false
              }
            ]);
        });

        it('should set hasFreeAccessBlogs to false', function(){
          expect($scope.model.hasFreeAccessBlogs).toBe(false);
        });

        it('should set hasPaidBlogs to true', function(){
          expect($scope.model.hasPaidBlogs).toBe(true);
        });
      });

      describe('when paid and free access blogs exist', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 'accountBalance',
              isRetryingPayment: 'isRetryingPayment',
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: false
              },
              {
                freeAccess: true
              }
            ]);
        });

        it('should set hasFreeAccessBlogs to true', function(){
          expect($scope.model.hasFreeAccessBlogs).toBe(true);
        });

        it('should set hasPaidBlogs to true', function(){
          expect($scope.model.hasPaidBlogs).toBe(true);
        });
      });

      describe('when no account balance and not retrying payment and has paid blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 0,
              isRetryingPayment: false,
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: false
              }
            ]);
        });

        it('should set displayingAccountBalanceWarning to true', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(true);
        });
      });

      describe('when negative account balance and not retrying payment and has paid blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: -1,
              isRetryingPayment: false,
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: false
              }
            ]);
        });

        it('should set displayingAccountBalanceWarning to true', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(true);
        });
      });

      describe('when no account balance and retrying payment and has paid blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 0,
              isRetryingPayment: true,
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: false
              }
            ]);
        });

        it('should set displayingAccountBalanceWarning to false', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(false);
        });
      });

      describe('when no account balance and not retrying payment and does not have paid blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 0,
              isRetryingPayment: false,
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: true
              }
            ]);
        });

        it('should set displayingAccountBalanceWarning to false', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(false);
        });
      });

      describe('when has account balance and not retrying payment and has paid blogs', function(){
        beforeEach(function(){
          target.internal.updateModel(
            {
              accountBalance: 1,
              isRetryingPayment: false,
              paymentStatus: 'paymentStatus',
              hasPaymentInformation: 'hasPaymentInformation'
            },
            [
              {
                freeAccess: false
              }
            ]);
        });

        it('should set displayingAccountBalanceWarning to false', function(){
          expect($scope.displayingAccountBalanceWarning).toBe(false);
        });
      });
    });

    describe('when reload is called', function(){
      var result;
      beforeEach(function(){
        accountSettingsRepositoryFactory.forCurrentUser.calls.reset();
        subscriptionRepositoryFactory.forCurrentUser.calls.reset();

        spyOn(target.internal, 'load').and.returnValue('result');

        result = target.internal.reload();
      });

      it('should update accountSettingsRepository', function(){
        expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
      });

      it('should update subscriptionRepository', function(){
        expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
      });

      it('should call load', function(){
        expect(target.internal.load).toHaveBeenCalledWith();
      });

      it('should return the result', function(){
        expect(result).toBe('result');
      });
    });

    describe('when load is called', function(){
      var success;
      var error;
      var deferredTryGetAccountSettings;
      var deferredTryGetBlogs;
      var deferredUpdateModel;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredTryGetAccountSettings = $q.defer();
        accountSettingsRepository.tryGetAccountSettings.and.returnValue(deferredTryGetAccountSettings.promise);

        deferredTryGetBlogs = $q.defer();
        subscriptionRepository.tryGetBlogs.and.returnValue(deferredTryGetBlogs.promise);

        deferredUpdateModel = $q.defer();
        spyOn(target.internal, 'updateModel');
        target.internal.updateModel.and.returnValue(deferredUpdateModel.promise);

        $scope.model.isLoaded = true;
        target.internal.load().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should set isLoaded to false', function(){
        expect($scope.model.isLoaded).toBe(false);
      });

      it('should call tryGetAccountSettings', function(){
        expect(accountSettingsRepository.tryGetAccountSettings).toHaveBeenCalledWith();
      });

      describe('when tryGetAccountSettings succeeds', function(){
        beforeEach(function(){
          deferredTryGetAccountSettings.resolve('accountSettings');
          $scope.$apply();
        });

        it('should call tryGetBlogs', function(){
          expect(subscriptionRepository.tryGetBlogs).toHaveBeenCalledWith();
        });

        describe('when tryGetBlogsSucceeds', function(){
          beforeEach(function(){
            deferredTryGetBlogs.resolve('blogs');
            $scope.$apply();
          });

          it('should call updateModel', function(){
            expect(target.internal.updateModel).toHaveBeenCalledWith('accountSettings', 'blogs');
          });

          describe('when updateModel succeeds', function(){
            beforeEach(function(){
              deferredUpdateModel.resolve();
              $scope.$apply();
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });

            it('should set isLoaded to true', function(){
              expect($scope.model.isLoaded).toBe(true);
            });
          });

          describe('when updateModel fails', function(){
            beforeEach(function(){
              deferredUpdateModel.reject('error');
              $scope.$apply();
            });

            it('should set the error message', function(){
              expect($scope.model.errorMessage).toBe('friendlyError');
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });
        });

        describe('when tryGetBlogs fails', function(){
          beforeEach(function(){
            deferredTryGetBlogs.reject('error');
            $scope.$apply();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });

      describe('when tryGetAccountSettings fails', function(){
        beforeEach(function(){
          deferredTryGetAccountSettings.reject('error');
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });
    });

    describe('when initialize is called', function(){
      var success;
      var error;
      var deferredLoad;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLoad = $q.defer();
        spyOn(target.internal, 'load');
        target.internal.load.and.returnValue(deferredLoad.promise);

        spyOn($scope, '$on');

        target.initialize().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should attach to aggregate user state updated event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.reload);
      });

      it('should call load', function(){
        expect(target.internal.load).toHaveBeenCalledWith();
      });

      describe('when load succeeds', function(){
        beforeEach(function(){
          deferredLoad.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when load fails', function(){
        beforeEach(function(){
          deferredLoad.reject('error');
          $scope.$apply();
        });

        it('should propagate error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});
