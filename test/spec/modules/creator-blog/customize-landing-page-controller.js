describe('customize landing page controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var blogRepositoryFactory;
  var blogRepository;
  var aggregateUserState;
  var blogStub;
  var blobImageControlFactory;
  var aggregateUserStateUtilities;
  var jsonService;
  var errorFacade;

  var defaultBlobControl;

  beforeEach(function() {

    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog', 'setBlog']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    aggregateUserState = { currentValue: { creatorStatus: { blogId: 'blogId' } } };
    blogStub = jasmine.createSpyObj('blogStub', ['putBlog']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    aggregateUserStateUtilities = jasmine.createSpyObj('aggregateUserStateUtilities', ['getUsername']);
    jsonService = jasmine.createSpyObj('jsonService', ['toSirTrevor']);

    defaultBlobControl = { control: true };
    blobImageControlFactory.createControl.and.returnValue(defaultBlobControl);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);

    aggregateUserStateUtilities.getUsername.and.returnValue('username');

    module('webApp');
    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('blogStub', blogStub);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('errorFacade', errorFacade);
      $provide.value('aggregateUserStateUtilities', aggregateUserStateUtilities);
      $provide.value('jsonService', jsonService);
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
        blogRepository.getBlog.and.returnValue($q.when({
          blah: 'blah'
        }));

        createController();
      });

      it('should get the blog repository', function(){
        expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalled();
      });

      it('should call getBlog', function(){
        expect(blogRepository.getBlog).toHaveBeenCalled();
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
        blogRepository.getBlog.and.returnValue($q.when({
          name: 'name',
          headerImage: undefined,
          description: 'description'
        }));

        jsonService.toSirTrevor.and.returnValue('sir-trevor');

        createController();
        $scope.$apply();
      });

      it('should get the current username', function(){
        expect(aggregateUserStateUtilities.getUsername).toHaveBeenCalled();
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.name).toBe('name');
        expect($scope.model.settings.headerImage).toBeUndefined();
      });

      it('should convert the description into sir trevor data', function(){
        expect(jsonService.toSirTrevor).toHaveBeenCalledWith([{
          type: 'text',
          data: {
            format: 'md',
            text: 'description'
          }
        }]);

        expect($scope.model.settings.description).toBe('sir-trevor');
      });

      it('should set the blob image to defaults', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith();
      });

      it('should set the landing page URL', function(){
        expect($scope.model.landingPageUrl).toBe('https://www.fifthweek.com/username');
      });
    });

    describe('when the user does not have a description', function(){

      beforeEach(function(){
        blogRepository.getBlog.and.returnValue($q.when({
          name: 'name',
          headerImage: undefined,
          description: ''
        }));

        createController();
        $scope.$apply();
      });

      it('should get the current username', function(){
        expect(aggregateUserStateUtilities.getUsername).toHaveBeenCalled();
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.name).toBe('name');
        expect($scope.model.settings.headerImage).toBeUndefined();
      });

      it('should not convert the description into sir trevor data', function(){
        expect(jsonService.toSirTrevor).not.toHaveBeenCalled();

        expect($scope.model.settings.description).toBe('');
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
        blogRepository.getBlog.and.returnValue($q.when({
          name: 'name',
          headerImage: {
            containerName: 'containerName',
            fileId: 'fileId'
          },
          description: 'description'
        }));

        jsonService.toSirTrevor.and.returnValue('sir-trevor');

        createController();
        $scope.$apply();
      });

      it('should get the current username', function(){
        expect(aggregateUserStateUtilities.getUsername).toHaveBeenCalled();
      });

      it('should set the settings', function(){
        expect($scope.model.settings).toBeDefined();
        expect($scope.model.settings.name).toBe('name');
        expect($scope.model.settings.headerImage.fileId).toBe('fileId');
        expect($scope.model.settings.headerImage.containerName).toBe('containerName');
      });

      it('should convert the description into sir trevor data', function(){
        expect(jsonService.toSirTrevor).toHaveBeenCalledWith([{
          type: 'text',
          data: {
            format: 'md',
            text: 'description'
          }
        }]);

        expect($scope.model.settings.description).toBe('sir-trevor');
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
        blogRepository.getBlog.and.returnValue($q.reject('error'));
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
      blogRepository.getBlog.and.returnValue($q.when({
        blogId: 'blogId',
        name: 'name',
        introduction: 'introduction',
        video: 'video',
        description: { firstText: 'description' },
        headerImage: {
          uri: 'uri',
          containerName: 'containerName',
          fileId: 'fileId'
        }
      }));

      jsonService.toSirTrevor.and.returnValue({ firstText: 'firstText' });

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
          blogStub.putBlog.and.returnValue($q.when());
          blogRepository.setBlog.and.returnValue($q.when());
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the blog settings', function(){
          expect(blogStub.putBlog).toHaveBeenCalledWith(
            'blogId',
            {
              name: 'name',
              introduction: 'introduction',
              headerImageFileId: undefined,
              video: 'video',
              description: 'firstText'
            }
          );
        });

        it('should update the aggregate user state', function(){
          expect(blogRepository.setBlog).toHaveBeenCalledWith(
            {
              blogId: 'blogId',
              name: 'name',
              introduction: 'introduction',
              video: 'video',
              description: 'firstText',
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
          blogStub.putBlog.and.returnValue($q.when());
          blogRepository.setBlog.and.returnValue($q.when());
          $scope.submitForm();
          $scope.$apply();
        });

        it('should save the blog settings', function(){
          expect(blogStub.putBlog).toHaveBeenCalledWith(
            'blogId',
            {
              name: 'name',
              introduction: 'introduction',
              headerImageFileId: 'fileId',
              video: 'video',
              description: 'firstText'
            }
          );
        });

        it('should update the aggregate user state', function(){
          expect(blogRepository.setBlog).toHaveBeenCalledWith(
            {
              blogId: 'blogId',
              name: 'name',
              introduction: 'introduction',
              video: 'video',
              description: 'firstText',
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

      describe('when saving blog settings fails', function(){

        var error;

        beforeEach(function(){
          blogStub.putBlog.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not update the aggregate user state', function(){
          expect(blogRepository.setBlog).not.toHaveBeenCalled();
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
          blogStub.putBlog.and.returnValue($q.when());
          blogRepository.setBlog.and.returnValue($q.reject('error'));
          $scope.submitForm().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should save the blog settings', function(){
          expect(blogStub.putBlog).toHaveBeenCalled();
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
