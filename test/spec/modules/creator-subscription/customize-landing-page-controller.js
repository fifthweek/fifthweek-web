describe('customize landing page controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var aggregateUserState;
  var subscriptionStub;
  var blobImageControlFactory;
  var aggregateUserStateUtilities;
  var errorFacade;

  var defaultBlobControl;

  beforeEach(function() {

    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['getSubscription', 'setSubscription']);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    aggregateUserState = { currentValue: { creatorStatus: { subscriptionId: 'subscriptionId' } } };
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['putSubscription']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    aggregateUserStateUtilities = jasmine.createSpyObj('aggregateUserStateUtilities', ['getUsername']);

    defaultBlobControl = { control: true };
    blobImageControlFactory.createControl.and.returnValue(defaultBlobControl);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);

    aggregateUserStateUtilities.getUsername.and.returnValue('username');

    module('webApp');
    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('errorFacade', errorFacade);
      $provide.value('aggregateUserStateUtilities', aggregateUserStateUtilities);
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
      target = $controller('customizeLandingPageCtrl', { $scope: $scope });
    });

    $scope.blobImage.update = jasmine.createSpy('update');
  };

  describe('when creating', function(){

    describe('when initializing', function(){

      beforeEach(function(){
        subscriptionRepository.getSubscription.and.returnValue($q.when({
          blah: 'blah'
        }));

        createController();
      });

      it('should get the subscription repository', function(){
        expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalled();
      });

      it('should call getSubscription', function(){
        expect(subscriptionRepository.getSubscription).toHaveBeenCalled();
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

    describe('when the user does not have a profile header image', function(){

      beforeEach(function(){
        subscriptionRepository.getSubscription.and.returnValue($q.when({
          subscriptionName: 'name',
          headerImage: undefined
        }));

        createController();
        $scope.$apply();
      });

      it('should get the current username', function(){
        expect(aggregateUserStateUtilities.getUsername).toHaveBeenCalled();
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.subscriptionName).toBe('name');
        expect($scope.model.settings.headerImage).toBeUndefined();
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith();
      });

      it('should set the landing page URL', function(){
        expect($scope.model.landingPageUrl).toBe('https://www.fifthweek.com/username');
      });
    });

    describe('when the user does have a profile image', function(){

      beforeEach(function(){
        subscriptionRepository.getSubscription.and.returnValue($q.when({
          subscriptionName: 'name',
          headerImage: {
            containerName: 'containerName',
            fileId: 'fileId'
          }
        }));

        createController();
        $scope.$apply();
      });

      it('should get the current username', function(){
        expect(aggregateUserStateUtilities.getUsername).toHaveBeenCalled();
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.subscriptionName).toBe('name');
        expect($scope.model.settings.headerImage.fileId).toBe('fileId');
        expect($scope.model.settings.headerImage.containerName).toBe('containerName');
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('containerName', 'fileId', true);
      });

      it('should set the landing page URL', function(){
        expect($scope.model.landingPageUrl).toBe('https://www.fifthweek.com/username');
      });
    });

    describe('when there is an error loading settings', function(){

      beforeEach(function(){
        subscriptionRepository.getSubscription.and.returnValue($q.reject('error'));
        createController();
        $scope.model.settings = { blah: 'blah' };
        $scope.$apply();
      });

      it('should log the error', function(){
        expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
      });

      it('should update the error message', function(){
        expect($scope.model.errorMessage).toBe('friendlyError');
      });

      it('should set account settings to undefined', function(){
        expect($scope.model.settings).toBeUndefined();
      });
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      subscriptionRepository.getSubscription.and.returnValue($q.when({
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

      it('should set the new profile image id', function(){
        expect($scope.model.settings.headerImage.fileId).toBe('fileId');
        expect($scope.model.settings.headerImage.containerName).toBe('containerName');
      });

      it('should set the form to dirty', function(){
        expect($scope.form.$setDirty).toHaveBeenCalled();
      });

      it('should update the blob image', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('containerName', 'fileId', false);
      });
    });

    describe('when submitForm is called', function(){

      describe('when no header image exists', function(){

        beforeEach(function(){
          $scope.model.settings.headerImage = undefined;
          subscriptionStub.putSubscription.and.returnValue($q.when());
          subscriptionRepository.setSubscription.and.returnValue($q.when());
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the subscription settings', function(){
          expect(subscriptionStub.putSubscription).toHaveBeenCalledWith(
            'subscriptionId',
            {
              subscriptionName: 'name',
              tagline: 'tagline',
              introduction: 'introduction',
              headerImageFileId: undefined,
              video: 'video',
              description: 'description'
            }
          );
        });

        it('should update the aggregate user state', function(){
          expect(subscriptionRepository.setSubscription).toHaveBeenCalledWith(
            {
              subscriptionId: 'subscriptionId',
              subscriptionName: 'name',
              tagline: 'tagline',
              introduction: 'introduction',
              video: 'video',
              description: 'description',
              headerImage: undefined
            }
          );
        });

        it('should set the form to pristine', function(){
          expect($scope.form.$setPristine).toHaveBeenCalled();
        });
      });

      describe('when a header image exists', function(){

        beforeEach(function(){
          subscriptionStub.putSubscription.and.returnValue($q.when());
          subscriptionRepository.setSubscription.and.returnValue($q.when());
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the subscription settings', function(){
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

        it('should update the aggregate user state', function(){
          expect(subscriptionRepository.setSubscription).toHaveBeenCalledWith(
            {
              subscriptionId: 'subscriptionId',
              subscriptionName: 'name',
              tagline: 'tagline',
              introduction: 'introduction',
              video: 'video',
              description: 'description',
              headerImage: {
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

      describe('when saving subscription settings fails', function(){

        var error;

        beforeEach(function(){
          subscriptionStub.putSubscription.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not update the aggregate user state', function(){
          expect(subscriptionRepository.setSubscription).not.toHaveBeenCalled();
        });

        it('should not set the form to pristine', function(){
          expect($scope.form.$setPristine).not.toHaveBeenCalled();
        });

        it('should propagate the error back to the caller', function(){
          expect(error).toBe('error');
        });
      });

      describe('when updating aggregate user state fails', function(){

        var error;

        beforeEach(function(){
          subscriptionStub.putSubscription.and.returnValue($q.when());
          subscriptionRepository.setSubscription.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should save the subscription settings', function(){
          expect(subscriptionStub.putSubscription).toHaveBeenCalled();
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
