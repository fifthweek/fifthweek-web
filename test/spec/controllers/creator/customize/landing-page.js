describe('customize landing page controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var authenticationService;
  var aggregateUserState;
  var subscriptionStub;
  var logService;
  var utilities;
  var blobImageControlFactory;

  var defaultBlobControl;

  beforeEach(function() {

    authenticationService = jasmine.createSpyObj('authenticationService', ['updateUsername']);
    aggregateUserState = { currentValue: { creatorStatus: { subscriptionId: 'subscriptionId' } } };
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['getSubscription', 'putSubscription']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);

    defaultBlobControl = { control: true };
    blobImageControlFactory.createControl.and.returnValue(defaultBlobControl);

    module('webApp');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('logService', logService);
      $provide.value('utilities', utilities);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    $scope.form = jasmine.createSpyObj('form', ['$setDirty','$setPristine']);
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('customizeLandingPageCtrl', { $scope: $scope });
    });

    $scope.blobImage.update = jasmine.createSpy('update');
  };

  describe('when creating', function(){

    beforeEach(function(){
      authenticationService.currentUser = { username: 'username' };
    });

    describe('when initializing', function(){

      beforeEach(function(){
        subscriptionStub.getSubscription.and.returnValue($q.when({ data: {
          email: 'email',
          profileImage: undefined
        }}));

        createController();
      });

      it('should call getSubscription with the subscription ID', function(){
        expect(subscriptionStub.getSubscription).toHaveBeenCalledWith('subscriptionId');
      });

      it('should set the blobImage control variable', function(){
        expect($scope.blobImage).toBeDefined();
      });

      it('should initialize the model', function(){
        expect($scope.model).toBeDefined();
      });

      it('should set the landing page URL', function(){
        expect($scope.model.landingPageUrl).toBe('https://www.fifthweek.com/username');
      });

      it('should load the current settings', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should set blobImage to a new control object', function(){
        expect(blobImageControlFactory.createControl).toHaveBeenCalled();
        expect($scope.blobImage).toEqual(defaultBlobControl);
      });
    });

    describe('when initializing with no subscription id', function(){

      beforeEach(function(){
        aggregateUserState.currentValue.creatorStatus.subscriptionId = undefined;

        createController();
      });

      it('should not call getSubscription', function(){
        expect(subscriptionStub.getSubscription).not.toHaveBeenCalled();
      });

      it('should set the error message', function(){
        expect($scope.model.errorMessage).toBeDefined();
      });

      it('should not be loading', function(){
        expect($scope.model.isLoading).toBe(false);
      });
    });

    describe('when initializing with no user state', function(){

      beforeEach(function(){
        aggregateUserState.currentValue = undefined;

        createController();
      });

      it('should not call getSubscription', function(){
        expect(subscriptionStub.getSubscription).not.toHaveBeenCalled();
      });

      it('should set the error message', function(){
        expect($scope.model.errorMessage).toBeDefined();
      });

      it('should not be loading', function(){
        expect($scope.model.isLoading).toBe(false);
      });
    });

    describe('when the user does not have a profile header image', function(){

      beforeEach(function(){
        subscriptionStub.getSubscription.and.returnValue($q.when({ data: {
          subscriptionName: 'name',
          headerImage: undefined
        }}));

        createController();
        $scope.$apply();
      });

      it('should set isLoading to false when complete', function(){
        expect($scope.model.isLoading).toBe(false);
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.subscriptionName).toBe('name');
        expect($scope.model.settings.headerImageFileId).toBeUndefined();
      });

      it('should remove the headerImage property', function(){
        expect(_.has($scope.model.settings, 'headerImage')).toBeFalsy();
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith();
      });
    });

    describe('when the user does have a profile image', function(){

      beforeEach(function(){
        subscriptionStub.getSubscription.and.returnValue($q.when({ data: {
          subscriptionName: 'name',
          headerImage: {
            uri: 'uri',
            containerName: 'containerName',
            fileId: 'fileId'
          }
        }}));

        createController();
        $scope.$apply();
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.subscriptionName).toBe('name');
        expect($scope.model.settings.headerImageFileId).toBe('fileId');
      });

      it('should remove the headerImage property', function(){
        expect(_.has($scope.model.settings, 'headerImage')).toBeFalsy();
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('uri', 'containerName', true);
      });
    });

    describe('when there is an error loading settings', function(){

      beforeEach(function(){
        utilities.getFriendlyErrorMessage.and.returnValue('friendlyError');
        subscriptionStub.getSubscription.and.returnValue($q.reject('error'));
        createController();
        $scope.model.settings = { blah: 'blah' };
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
        expect($scope.model.settings).toBeUndefined();
      });

      it('should set isLoading to false', function(){
        expect($scope.model.isLoading).toBe(false);
      });
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      authenticationService.currentUser = { username: 'username' };

      subscriptionStub.getSubscription.and.returnValue($q.when({ data: {
        subscriptionId: 'subscriptionId',
        subscriptionName: 'name',
        tagline: 'tagline',
        introduction: 'introduction',
        video: 'video',
        description: 'description',
        headerImage: {
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
        expect($scope.model.settings.headerImageFileId).toBe('fileId');
      });

      it('should set the form to dirty', function(){
        expect($scope.form.$setDirty).toHaveBeenCalled();
      });

      it('should update the blob image', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('fileUri', 'containerName', false);
      });
    });

    describe('when submitForm is called', function(){

      describe('when saving account settings succeeds', function(){

        beforeEach(function(){
          subscriptionStub.putSubscription.and.returnValue($q.when());
          $scope.model.password = 'password';
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the account settings', function(){
          expect(subscriptionStub.putSubscription).toHaveBeenCalledWith(
            'subscriptionId',
            {
              subscriptionName: 'name',
              tagline: 'tagline',
              introduction: 'introduction',
              headerImageFileId: 'fileId',
              video: 'video',
              description: 'description'
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
          subscriptionStub.putSubscription.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not set the form to pristine', function(){
          expect($scope.form.$setPristine).not.toHaveBeenCalled();
        });

        it('should propagate the error back to the caller', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});
