describe('creator account settings controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var accountSettingsStub;
  var errorFacade;
  var $state;
  var states;
  var authorizationService;
  var authorizationServiceConstants;
  var authenticationService;
  var authenticationServiceConstants;
  var fetchAggregateUserState;
  var initializer;

  beforeEach(function() {

    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'setAccountSettings', 'getUserId']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsStub = jasmine.createSpyObj('accountSettingsStub', ['putCreatorInformation']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    $state = jasmine.createSpyObj('$state', ['go']);
    authorizationService = jasmine.createSpyObj('authorizationService', ['authorize']);
    authenticationService = jasmine.createSpyObj('authenticationService', ['refreshToken']);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateInParallel']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);

    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    accountSettingsRepository.getUserId.and.returnValue('userId');

    module('webApp');
    module(function($provide) {
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('accountSettingsStub', accountSettingsStub);
      $provide.value('errorFacade', errorFacade);
      $provide.value('$state', $state);
      $provide.value('authorizationService', authorizationService);
      $provide.value('authenticationService', authenticationService);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('initializer', initializer);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      states = $injector.get('states');
      authorizationServiceConstants = $injector.get('authorizationServiceConstants');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });

    $scope.form = jasmine.createSpyObj('form', ['$setPristine']);
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('creatorAccountSettingsCtrl', { $scope: $scope });
    });
  };

  describe('when created', function(){
    beforeEach(createController);

    it('should initialize default to not a creator', function(){
      expect($scope.model.isCreator).toBe(false);
    });

    it('should set account settings to undefined', function(){
      expect($scope.model.accountSettings).toBeUndefined();
    });

    it('should set the error message to undefined', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should initialize by loading the form', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.loadForm);
    });

    describe('when calling setIsCreator', function(){
      describe('when user is creator', function(){
        beforeEach(function(){
          authorizationService.authorize.and.returnValue(authorizationServiceConstants.authorizationResult.authorized);
          target.internal.setIsCreator();
          $scope.$apply();
        });

        it('should set isCreator to true', function(){
          expect($scope.model.isCreator).toBe(true);
        });
      });

      describe('when user is not a creator', function(){
        beforeEach(function(){
          authorizationService.authorize.and.returnValue(authorizationServiceConstants.authorizationResult.notAuthorized);
          target.internal.setIsCreator();
          $scope.$apply();
        });

        it('should set isCreator to false', function(){
          expect($scope.model.isCreator).toBe(false);
        });
      });
    });

    describe('when loading form', function(){

      var error;
      var success;
      var deferredGetAccountSettings;
      beforeEach(function(){
        error = undefined;
        success = undefined;
        deferredGetAccountSettings = $q.defer();
        spyOn(target.internal, 'setIsCreator');
        accountSettingsRepository.getAccountSettings.and.returnValue(deferredGetAccountSettings.promise);
        target.internal.loadForm().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call setIsCreator', function(){
        expect(target.internal.setIsCreator).toHaveBeenCalledWith();
      });

      it('should call getAccountSettings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
      });

      describe('when getAccountSettings succeeds', function(){
        beforeEach(function(){
          deferredGetAccountSettings.resolve('accountSettings');
          $scope.$apply();
        });

        it('should assign account settings to the model', function(){
          expect($scope.model.accountSettings).toBe('accountSettings');
        });
      });

      describe('when getAccountSettings fails', function(){
        beforeEach(function(){
          $scope.model.accountSettings = 'something';
          deferredGetAccountSettings.reject('error');
          $scope.$apply();
        });

        it('should call handleError', function(){
          expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
        });

        it('should set accountSettings to undefined', function(){
          expect($scope.model.accountSettings).toBeUndefined();
        });

        it('should assign the friendly error message to the model', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });
      });
    });

    describe('when calling updateCreatorStatus', function(){
      var error;
      var success;
      var deferredUpdateInParallel;
      beforeEach(function(){
        error = undefined;
        success = undefined;
        deferredUpdateInParallel = $q.defer();
        fetchAggregateUserState.updateInParallel.and.returnValue(deferredUpdateInParallel.promise);
        target.internal.updateCreatorStatus('userId').then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call updateInParallel', function(){
        expect(fetchAggregateUserState.updateInParallel).toHaveBeenCalledWith('userId', authenticationService.refreshToken);
      });

      describe('when updateInParallel succeeds', function(){
        beforeEach(function(){
          deferredUpdateInParallel.resolve();
          $scope.$apply();
        });

        it('should change state', function(){
          expect($state.go).toHaveBeenCalledWith(states.creator.createBlog.name);
        });
      });

      describe('when updateInParallel fails', function(){
        beforeEach(function(){
          deferredUpdateInParallel.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling onAccountSettingsSaved', function(){
      var success;
      var error;
      beforeEach(function(){
        success = undefined;
        error = undefined;
      });

      describe('when user is a creator', function(){
        beforeEach(function(){
          $scope.model.isCreator = true;
          target.internal.onAccountSettingsSaved('userId').then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should set the form to pristine', function(){
          expect($scope.form.$setPristine).toHaveBeenCalledWith();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when user is not a creator', function(){
        var deferredUpdateCreatorStatus;
        beforeEach(function(){
          deferredUpdateCreatorStatus = $q.defer();
          spyOn(target.internal, 'updateCreatorStatus');
          target.internal.updateCreatorStatus.and.returnValue(deferredUpdateCreatorStatus.promise);

          $scope.model.isCreator = false;
          target.internal.onAccountSettingsSaved('userId').then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call updateCreatorStatus', function(){
          expect(target.internal.updateCreatorStatus).toHaveBeenCalledWith('userId');
        });

        describe('when updateCreatorStatus succeeds', function(){
          beforeEach(function(){
            deferredUpdateCreatorStatus.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when updateCreatorStatus fails', function(){
          beforeEach(function(){
            deferredUpdateCreatorStatus.reject('error');
            $scope.$apply();
          });

          it('should complete propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('when submitForm is called', function(){
      var error;
      var success;
      var deferredPutCreatorInformation;
      var deferredSetAccountSettings;
      var deferredOnAccountSettingsSaved;
      beforeEach(function(){
        error = undefined;
        success = undefined;
        deferredPutCreatorInformation = $q.defer();
        accountSettingsStub.putCreatorInformation.and.returnValue(deferredPutCreatorInformation.promise);
        deferredSetAccountSettings = $q.defer();
        accountSettingsRepository.setAccountSettings.and.returnValue(deferredSetAccountSettings.promise);
        deferredOnAccountSettingsSaved = $q.defer();
        spyOn(target.internal, 'onAccountSettingsSaved').and.returnValue(deferredOnAccountSettingsSaved.promise);

        $scope.model.accountSettings = { name: 'name' };

        $scope.submitForm().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call getUserId', function(){
        expect(accountSettingsRepository.getUserId).toHaveBeenCalledWith();
      });

      it('should call putCreatorInformation', function(){
        expect(accountSettingsStub.putCreatorInformation).toHaveBeenCalledWith('userId', { /* name: 'name' */ });
      });

      describe('when putCreatorInformation succeeds', function(){
        beforeEach(function(){
          deferredPutCreatorInformation.resolve();
          $scope.$apply();
        });

        it('should call setAccountSettings', function(){
          expect(accountSettingsRepository.setAccountSettings).toHaveBeenCalledWith($scope.model.accountSettings);
        });

        describe('when setAccountSettings succeeds', function(){
          beforeEach(function(){
            deferredSetAccountSettings.resolve();
            $scope.$apply();
          });

          it('should call onAccountSettingsSaved', function(){
            expect(target.internal.onAccountSettingsSaved).toHaveBeenCalledWith('userId');
          });

          describe('when onAccountSettingsSaved succeeds', function(){
            beforeEach(function(){
              deferredOnAccountSettingsSaved.resolve();
              $scope.$apply();
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when onAccountSettingsSaved fails', function(){
            beforeEach(function(){
              deferredOnAccountSettingsSaved.reject('error');
              $scope.$apply();
            });

            it('should propagate the error', function(){
              expect(error).toBe(error);
            });
          });
        });

        describe('when setAccountSettings fails', function(){
          beforeEach(function(){
            deferredSetAccountSettings.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe(error);
          });
        });
      });

      describe('when putCreatorInformation fails', function(){
        beforeEach(function(){
          deferredPutCreatorInformation.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe(error);
        });
      });
    });
  });
});
