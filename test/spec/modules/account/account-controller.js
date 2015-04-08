describe('account controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var accountSettingsStub;
  var errorFacade;
  var blobImageControlFactory;

  var defaultBlobControl;

  beforeEach(function() {

    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'setAccountSettings', 'getUserId']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsStub = jasmine.createSpyObj('accountSettingsStub', ['put']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);

    defaultBlobControl = { control: true };
    blobImageControlFactory.createControl.and.returnValue(defaultBlobControl);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    accountSettingsRepository.getUserId.and.returnValue('userId');

    module('webApp');
    module(function($provide) {
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('accountSettingsStub', accountSettingsStub);
      $provide.value('errorFacade', errorFacade);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });

    $scope.form = jasmine.createSpyObj('form', ['$setDirty','$setPristine']);
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('AccountCtrl', { $scope: $scope });
    });

    $scope.blobImage.update = jasmine.createSpy('update');
  };

  describe('when creating', function(){

    describe('when initializing', function(){

      beforeEach(function(){
        accountSettingsRepository.getAccountSettings.and.returnValue($q.when({
          email: 'email',
          username: 'username',
          profileImage: undefined
        }));

        createController();
      });

      it('should get the account settings repository', function(){
        expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalled();
      });

      it('should call getAccountSettings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalled();
      });

      it('should set the blobImage control variable', function(){
        expect($scope.blobImage).toBeDefined();
      });

      it('should initialize the model', function(){
        expect($scope.model).toBeDefined();
      });

      it('should set blobImage to a new control object', function(){
        expect(blobImageControlFactory.createControl).toHaveBeenCalled();
        expect($scope.blobImage).toEqual(defaultBlobControl);
      });
    });

    describe('when the user does not have a profile image', function(){

      beforeEach(function(){
        accountSettingsRepository.getAccountSettings.and.returnValue($q.when({
          email: 'email',
          username: 'username',
          profileImage: undefined
        }));

        createController();
        $scope.$apply();
      });

      it('should set the accountSettings', function(){
        expect($scope.model.accountSettings).toBeDefined();
        expect($scope.model.accountSettings.email).toBe('email');
        expect($scope.model.accountSettings.username).toBe('username');
        expect($scope.model.accountSettings.profileImage).toBeUndefined();
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith();
      });
    });

    describe('when the user does have a profile image', function(){

      beforeEach(function(){
        accountSettingsRepository.getAccountSettings.and.returnValue($q.when({
          email: 'email',
          username: 'username',
          profileImage: {
            containerName: 'containerName',
            fileId: 'fileId'
          }
        }));

        createController();
        $scope.$apply();
      });

      it('should set the accountSettings', function(){
        expect($scope.model.accountSettings).toBeDefined();
        expect($scope.model.accountSettings.email).toBe('email');
        expect($scope.model.accountSettings.username).toBe('username');
        expect($scope.model.accountSettings.profileImage.containerName).toBe('containerName');
        expect($scope.model.accountSettings.profileImage.fileId).toBe('fileId');
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('containerName', 'fileId', true);
      });
    });

    describe('when there is an error loading account settings', function(){

      beforeEach(function(){
        accountSettingsRepository.getAccountSettings.and.returnValue($q.reject('error'));
        createController();
        $scope.model.accountSettings = { blah: 'blah' };
        $scope.$apply();
      });

      it('should log the error', function(){
        expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
      });

      it('should update the error message', function(){
        expect($scope.model.errorMessage).toBe('friendlyError');
      });

      it('should set account settings to undefined', function(){
        expect($scope.model.accountSettings).toBeUndefined();
      });
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      accountSettingsRepository.getAccountSettings.and.returnValue($q.when({
        email: 'email',
        username: 'username',
        profileImage: {
          uri: 'uri',
          containerName: 'containerName',
          fileId: 'fileId'
        }
      }));

      createController();

      $scope.$apply();
    });

    describe('when onUploadComplete is called', function(){
      beforeEach(function(){
        $scope.onUploadComplete({
          fileId: 'fileId',
          containerName: 'containerName'
        });
      });

      it('should set the new profile image', function(){
        expect($scope.model.accountSettings.profileImage.fileId).toBe('fileId');
        expect($scope.model.accountSettings.profileImage.containerName).toBe('containerName');
      });

      it('should set the form to dirty', function(){
        expect($scope.form.$setDirty).toHaveBeenCalled();
      });

      it('should update the blob image', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('containerName', 'fileId', false);
      });
    });

    describe('when submitForm is called', function(){

      describe('when no profile image exists', function(){

        beforeEach(function(){
          $scope.model.accountSettings.profileImage = undefined;

          accountSettingsStub.put.and.returnValue($q.when());
          accountSettingsRepository.setAccountSettings.and.returnValue($q.when());
          $scope.model.password = 'password';
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the account settings to the server', function(){
          expect(accountSettingsStub.put).toHaveBeenCalledWith(
            'userId',
            {
              newEmail: 'email',
              newUsername: 'username',
              newPassword: 'password',
              newProfileImageId: undefined
            }
          );
        });

        it('should save the account settings to the aggregate user state', function(){
          expect(accountSettingsRepository.setAccountSettings).toHaveBeenCalledWith(
            {
              email: 'email',
              username: 'username',
              profileImage: undefined
            }
          );
        });

        it('should set the form to pristine', function(){
          expect($scope.form.$setPristine).toHaveBeenCalled();
        });
      });

      describe('when a profile image exists', function(){

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.when());
          accountSettingsRepository.setAccountSettings.and.returnValue($q.when());
          $scope.model.password = 'password';
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the account settings to the server', function(){
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

        it('should save the account settings to the aggregate user state', function(){
          expect(accountSettingsRepository.setAccountSettings).toHaveBeenCalledWith(
            {
              email: 'email',
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                uri: 'uri',
                containerName: 'containerName'
              }
            }
          );
        });

        it('should set the form to pristine', function(){
          expect($scope.form.$setPristine).toHaveBeenCalled();
        });
      });

      describe('when saving account settings fails', function(){

        var error;

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not update the aggregate user state', function(){
          expect(accountSettingsRepository.setAccountSettings).not.toHaveBeenCalled();
        });

        it('should not set the form to pristine', function(){
          expect($scope.form.$setPristine).not.toHaveBeenCalled();
        });

        it('should propagate the error back to the caller', function(){
          expect(error).toBe('error');
        });
      });

      describe('when the user has not updated his password', function(){

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.when());
          accountSettingsRepository.setAccountSettings.and.returnValue($q.when());
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

        it('should save the account settings to the aggregate user state', function(){
          expect(accountSettingsRepository.setAccountSettings).toHaveBeenCalledWith(
            {
              email: 'email',
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                uri: 'uri',
                containerName: 'containerName'
              }
            }
          );
        });
      });

      describe('when updating aggregate user state fails', function(){

        var error;

        beforeEach(function(){
          accountSettingsStub.put.and.returnValue($q.when());
          accountSettingsRepository.setAccountSettings.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should save the blog settings', function(){
          expect(accountSettingsStub.put).toHaveBeenCalled();
        });

        it('should not set the form to pristine', function(){
          expect($scope.form.$setPristine).not.toHaveBeenCalled();
        });

        it('should propagate the error back to the caller', function(){
          expect(error).toBe('error');
        });
      });   });
  });
});
