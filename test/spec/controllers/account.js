'use strict';

describe('account controller', function () {

  var $q;
  var $scope;
  var target;

  var authenticationService;
  var accountSettingsStub;
  var logService;
  var utilities;

  beforeEach(function() {

    authenticationService = jasmine.createSpyObj('authenticationService', ['updateUsername']);
    accountSettingsStub = jasmine.createSpyObj('accountSettingsStub', ['get', 'put']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);

    module('webApp');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('accountSettingsStub', accountSettingsStub);
      $provide.value('logService', logService);
      $provide.value('utilities', utilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('AccountCtrl', { $scope: $scope });
    });

    $scope.blobImage.update = jasmine.createSpy('update');
  };

  describe('when creating', function(){

    beforeEach(function(){
      authenticationService.currentUser = { username: 'username', userId: 'userId' };
    });
    describe('when initializing', function(){

      beforeEach(function(){
        accountSettingsStub.get.and.returnValue($q.when({ data: {
          email: 'email',
          profileImage: undefined
        }}));

        createController();
      });

      it('should set the blobImage control variable', function(){
        expect($scope.blobImage).toBeDefined();
      });

      it('should initialize the model', function(){
        expect($scope.model).toBeDefined();
      });

      it('should load the current user settings', function(){
        expect($scope.model.isLoading).toBe(true);
      });
    });

    describe('when the user does not have a profile image', function(){

      beforeEach(function(){
        accountSettingsStub.get.and.returnValue($q.when({ data: {
          email: 'email',
          profileImage: undefined
        }}));

        createController();
        $scope.$apply();
      });

      it('should set isLoading to false when complete', function(){
        expect($scope.model.isLoading).toBe(false);
      });

      it('should set the accountSettings', function(){
        expect($scope.model.accountSettings).toBeDefined();
        expect($scope.model.accountSettings.email).toBe('email');
        expect($scope.model.accountSettings.username).toBe('username');
        expect($scope.model.accountSettings.userId).toBe('userId');
        expect($scope.model.accountSettings.profileImageId).toBeUndefined();
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith();
      });
    });

    describe('when the user does have a profile image', function(){

      beforeEach(function(){
        accountSettingsStub.get.and.returnValue($q.when({ data: {
          email: 'email',
          profileImage: {
            uri: 'uri',
            containerName: 'containerName',
            fileId: 'fileId'
          }
        }}));

        createController();
        $scope.$apply();
      });

      it('should set the accountSettings', function(){
        expect($scope.model.accountSettings).toBeDefined();
        expect($scope.model.accountSettings.email).toBe('email');
        expect($scope.model.accountSettings.username).toBe('username');
        expect($scope.model.accountSettings.userId).toBe('userId');
        expect($scope.model.accountSettings.profileImageId).toBe('fileId');
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('uri', 'containerName', true);
      });
    });

    describe('when there is an error loading account settings', function(){

      beforeEach(function(){
        utilities.getFriendlyErrorMessage.and.returnValue('friendlyError');
        accountSettingsStub.get.and.returnValue($q.reject('error'));
        createController();
        $scope.model.accountSettings = { blah: 'blah' };
        $scope.$apply();
      });

      it('should log the error', function(){
        expect(logService.error).toHaveBeenCalledWith('error');
      });

      it('should update the error message', function(){
        expect(utilities.getFriendlyErrorMessage).toHaveBeenCalledWith('error');
        expect($scope.model.errorMessage).toBe('friendlyError');
      });

      it('should set account settings to undefined', function(){
        expect($scope.model.accountSettings).toBeUndefined();
      });

      it('should set isLoading to false', function(){
        expect($scope.model.isLoading).toBe(false);
      });
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      authenticationService.currentUser = { username: 'username', userId: 'userId' };

      accountSettingsStub.get.and.returnValue($q.when({ data: {
        email: 'email',
        profileImage: {
          uri: 'uri',
          containerName: 'containerName',
          fileId: 'fileId'
        }
      }}));

      createController();

      $scope.$apply();
    });

    describe('when onUploadComplete is called', function(){
      beforeEach(function(){
        $scope.onUploadComplete({
          fileId: 'fileId',
          fileUri: 'fileUri',
          containerName: 'containerName'
        });
      });

      it('should set the new profile image id', function(){
        expect($scope.model.accountSettings.profileImageId).toBe('fileId');
      });

      it('should update the blob image', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('fileUri', 'containerName', false);
      });
    });

    describe('when submitForm is called', function(){

      describe('when saving account settings succeeds', function(){

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.when());
          $scope.model.password = 'password';
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the account settings', function(){
          expect(accountSettingsStub.put).toHaveBeenCalledWith(
            'userId',
            {
              newEmail: 'email',
              newUsername: 'username',
              newPassword: 'password',
              newProfileImageId: 'fileId'
            }
          );
        });

        it('should update the username in the authentication service', function(){
          expect(authenticationService.updateUsername).toHaveBeenCalledWith('userId', 'username');
        });
      });

      describe('when saving account settings fails', function(){

        var error;

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not update the username in the authentication service', function(){
          expect(authenticationService.updateUsername).not.toHaveBeenCalled();
        });

        it('should propagate the error back to the caller', function(){
          expect(error).toBe('error');
        });
      });

      describe('when the user has not updated his password', function(){

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.when());
          $scope.model.password = '';
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the account settings with an undefined password', function(){
          expect(accountSettingsStub.put).toHaveBeenCalledWith(
            'userId',
            {
              newEmail: 'email',
              newUsername: 'username',
              newPassword: undefined,
              newProfileImageId: 'fileId'
            }
          );
        });
      });

      describe('when the user in the authentication service has changed', function(){

        beforeEach(function(){
          authenticationService.currentUser = { username: 'username2', userId: 'userId2' };
          accountSettingsStub.put.and.returnValue($q.when());
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the account settings with the original user id and password', function(){
          expect(accountSettingsStub.put).toHaveBeenCalledWith(
            'userId',
            {
              newEmail: 'email',
              newUsername: 'username',
              newPassword: undefined,
              newProfileImageId: 'fileId'
            }
          );
        });
      });
    });
  });
});
