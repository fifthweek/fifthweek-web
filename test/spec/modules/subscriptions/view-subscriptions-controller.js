describe('view-subscriptions-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var initializer;
  var aggregateUserStateConstants;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var fetchAggregateUserState;
  var landingPageConstants;
  var fwPostListConstants;
  var errorFacade;

  beforeEach(function() {
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['getBlogs']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'getUserId']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateFromServer']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    module('webApp');
    module(function($provide) {
      $provide.value('initializer', initializer);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      landingPageConstants = $injector.get('landingPageConstants');
      fwPostListConstants = $injector.get('fwPostListConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    accountSettingsRepository.getUserId.and.returnValue('userId');
    inject(function ($controller) {
      target = $controller('viewSubscriptionsCtrl', { $scope: $scope });
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

    it('should set blogs to an empty list', function(){
      expect($scope.model.blogs).toEqual([]);
    });
    it('should set accountBalance to undefined', function(){
      expect($scope.model.accountBalance).toBeUndefined();
    });

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should set the userId', function(){
      expect($scope.model.userId).toBe('userId');
    });

    it('should set landingPageConstants to the scope', function(){
      expect($scope.landingPageConstants).toBe(landingPageConstants);
    });

    it('should set fwPostListConstants to the scope', function(){
      expect($scope.fwPostListConstants).toBe(fwPostListConstants);
    });

    it('should call initialize', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when processBlogs is called', function(){
      describe('when no blogs', function(){
        beforeEach(function(){
          $scope.model.totalAcceptedPrice = undefined;
          $scope.model.totalChangedPrice = undefined;

          $scope.model.blogs = [];

          target.internal.processBlogs();
        });

        it('should set totalAcceptedPrice to zero', function(){
          expect($scope.model.totalAcceptedPrice).toBe(0);
        });

        it('should set totalChangedPrice to zero', function(){
          expect($scope.model.totalChangedPrice).toBe(0);
        });
      });

      describe('when blogs exist', function(){
        beforeEach(function(){
          $scope.model.totalAcceptedPrice = undefined;
          $scope.model.totalChangedPrice = undefined;

          $scope.model.blogs =
          [
            {
              freeAccess: false,
              channels: [
                {
                  acceptedPrice: 100,
                  price: 100
                },
                {
                  acceptedPrice: 90,
                  price: 200
                },
                {
                  acceptedPrice: 105,
                  price: 100
                }
              ]
            },
            {
              freeAccess: false,
              channels: [
                {
                  acceptedPrice: 101,
                  price: 100
                }
              ]
            },
            {
              freeAccess: false,
              channels: [
                {
                  acceptedPrice: 99,
                  price: 100
                }
              ]
            },
            {
              freeAccess: false,
              channels: [
                {
                  acceptedPrice: 0,
                  price: 100
                }
              ]
            },
            {
              freeAccess: true,
              channels: [
                {
                  acceptedPrice: 100,
                  price: 100
                }
              ]
            }
          ];

          target.internal.processBlogs();
        });

        it('should set totalAcceptedPrice', function(){
          expect($scope.model.totalAcceptedPrice).toBe(300);
        });

        it('should set totalChangedPrice', function(){
          expect($scope.model.totalChangedPrice).toBe(400);
        });
      });
    });

    describe('when refreshUserState is called', function(){
      var success;
      var error;
      var deferredUpdateFromServer;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredUpdateFromServer = $q.defer();
        fetchAggregateUserState.updateFromServer.and.returnValue(deferredUpdateFromServer.promise);

        target.internal.refreshUserState().then(function(){ success = true; }, function(e){ error = e; });
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

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });
      });
    });

    describe('when loadForm is called', function(){
      var success;
      var error;
      var deferredGetAccountSettings;
      var deferredGetBlogs;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredGetAccountSettings = $q.defer();
        accountSettingsRepository.getAccountSettings.and.returnValue(deferredGetAccountSettings.promise);

        deferredGetBlogs = $q.defer();
        subscriptionRepository.getBlogs.and.returnValue(deferredGetBlogs.promise);

        spyOn(target.internal, 'processBlogs');

        target.internal.loadForm().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call getAccountSettings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
      });

      describe('when getAccountSettings succeeds', function(){
        beforeEach(function(){
          deferredGetAccountSettings.resolve({ accountBalance: 100});
          $scope.$apply();
        });

        it('should set accountBalance', function(){
          expect($scope.model.accountBalance).toBe(100);
        });

        it('should call getBlogs', function(){
          expect(subscriptionRepository.getBlogs).toHaveBeenCalledWith();
        });

        describe('when getBlogs succeeds', function(){
          beforeEach(function(){
            deferredGetBlogs.resolve('blogs');
            $scope.$apply();
          });

          it('should set the blogs', function(){
            expect($scope.model.blogs).toBe('blogs');
          });

          it('should call processBlogs', function(){
            expect(target.internal.processBlogs).toHaveBeenCalledWith();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getBlogs fails', function(){
          beforeEach(function(){
            deferredGetBlogs.reject('error');
            $scope.$apply();
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });
        });
      });

      describe('when getAccountSettings fails', function(){
        beforeEach(function(){
          deferredGetAccountSettings.reject('error');
          $scope.$apply();
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
      var deferredRefreshUserState;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLoadForm = $q.defer();
        spyOn(target.internal, 'loadForm').and.returnValue(deferredLoadForm.promise);

        deferredRefreshUserState = $q.defer();
        spyOn(target.internal, 'refreshUserState').and.returnValue(deferredRefreshUserState.promise);

        spyOn($scope, '$on');

        target.internal.initialize().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should attach to the user state updated event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.loadForm);
      });

      it('should attach to the reload event', function(){
        expect($scope.$on).toHaveBeenCalledWith(fwPostListConstants.reloadEvent, target.internal.refreshUserState);
      });

      it('should call loadForm', function(){
        expect(target.internal.loadForm).toHaveBeenCalledWith();
      });

      describe('when loadForm succeeds', function(){
        beforeEach(function(){
          deferredLoadForm.resolve();
          $scope.$apply();
        });

        it('should call refreshUserState', function(){
          expect(target.internal.refreshUserState).toHaveBeenCalledWith();
        });

        describe('when refreshUserState succeeds', function(){
          beforeEach(function(){
            deferredRefreshUserState.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when refreshUserState fails', function(){
          beforeEach(function(){
            deferredRefreshUserState.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
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
