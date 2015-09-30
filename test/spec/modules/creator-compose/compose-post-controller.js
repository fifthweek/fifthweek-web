describe('compose post controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var composeUtilities;
  var blobImageControlFactory;
  var postStub;
  var initializer;
  var blogRepositoryFactory;
  var blogRepository;

  var control;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['reload']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    postStub = jasmine.createSpyObj('postStub', ['postPost']);
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['updateEstimatedLiveDate']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getQueuesSorted']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);

    control = {
      update: jasmine.createSpy('update')
    };

    blobImageControlFactory.createControl.and.returnValue(control);

    module('webApp');
    module(function($provide) {
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('postStub', postStub);
      $provide.value('$state', $state);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('initializer', initializer);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('composePostCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){

    beforeEach(function(){
      createController();
    });

    it('should get the blob repository', function(){
      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should create the blob image control', function(){
      expect(blobImageControlFactory.createControl).toHaveBeenCalled();
      expect($scope.blobImage).toBe(control);
    });

    it('should set fileUploaded to false', function(){
      expect($scope.model.fileUploaded).toBe(false);
    });

    it('should set imageUploaded to false', function(){
      expect($scope.model.imageUploaded).toBe(false);
    });

    it('should set postLater to false', function(){
      expect($scope.model.postLater).toBe(false);
    });

    it('should set postToQueue to true', function(){
      expect($scope.model.postToQueue).toBe(true);
    });

    it('should set committedChannel to undefined', function(){
      expect($scope.model.committedChannel).toBeUndefined();
    });

    it('should set the error message to undefined', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set the inputs to empty', function(){
      expect($scope.model.input.fileId).toBeUndefined();
      expect($scope.model.input.imageId).toBeUndefined();
      expect($scope.model.input.comment).toBe('');
      expect($scope.model.input.date).toBe('');
      expect($scope.model.input.selectedQueue).toBeUndefined();
    });

    it('should call initializer with the initialize function', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function() {
      createController();
      $scope.$apply();
    });

    describe('when calling initialize', function(){

    });

    describe('when calling onImageUploadComplete', function(){
      var data;
      beforeEach(function(){
        data = {fileId: 'fileId', containerName: 'containerName'};
        $scope.model.imageUploaded = false;
        $scope.onImageUploadComplete(data);
      });

      it('should set imageUploaded to true', function(){
        expect($scope.model.imageUploaded).toBe(true);
      });

      it('should set the imageId', function(){
        expect($scope.model.input.imageId).toBe('fileId');
      });

      it('should set processingImage to true', function(){
        expect($scope.model.processingImage).toBe(true);
      });

      it('should update the blob image', function(){
        expect(control.update).toHaveBeenCalledWith('containerName', 'fileId', false, target.internal.onBlobImageUpdateComplete);
      });
    });

    describe('when calling internal.onBlobImageUpdateComplete', function(){
      beforeEach(function(){
        $scope.model.processingImage = true;
        target.internal.onBlobImageUpdateComplete({ renderSize: 'renderSize' });
      });

      it('should set processingImage to false', function(){
        expect($scope.model.processingImage).toBe(false);
      });
    });

    describe('when calling onFileUploadComplete', function(){
      var data;
      beforeEach(function(){
        data = {fileId: 'fileId', containerName: 'containerName', file: { name: 'fileName' }};
        $scope.model.fileUploaded = false;
        $scope.onFileUploadComplete(data);
      });

      it('should set fileUploaded to true', function(){
        expect($scope.model.fileUploaded).toBe(true);
      });

      it('should set the fileId', function(){
        expect($scope.model.input.fileId).toBe('fileId');
      });

      it('should set the file name', function(){
        expect($scope.fileName).toBe('fileName');
      });
    });

    describe('when calling post', function(){
      var success;
      var error;
      var deferredPostPost;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredPostPost = $q.defer();
        postStub.postPost.and.returnValue(deferredPostPost.promise);

        $scope.$close = jasmine.createSpy('$close');

        target.internal.post('data').then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call postPost', function(){
        expect(postStub.postPost).toHaveBeenCalledWith('data');
      });

      describe('when postPost succeeds', function(){
        beforeEach(function(){
          deferredPostPost.resolve();
          $scope.$apply();
        });

        it('should reload the state', function(){
          expect($state.reload).toHaveBeenCalledWith();
        });

        it('should close the dialog', function(){
          expect($scope.$close).toHaveBeenCalledWith();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when postPost fails', function(){
        beforeEach(function(){
          deferredPostPost.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling commitChannel', function(){
      beforeEach(function(){
        $scope.commitChannel('committed-channel');
        $scope.$apply();
      });

      it('should store the committed channel', function(){
        expect($scope.model.committedChannel).toBe('committed-channel');
      });
    });

    describe('when calling postNow', function(){
      var success;
      var error;
      var deferredPost;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        $scope.model.committedChannel = { channelId: '5' };
        $scope.model.input.fileId = 'fileId';
        $scope.model.input.imageId = 'imageId';
        $scope.model.input.comment = 'comment';

        deferredPost = $q.defer();
        spyOn(target.internal, 'post').and.returnValue(deferredPost.promise);

        $scope.postNow().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call post', function(){
        expect(target.internal.post).toHaveBeenCalledWith({
          channelId: '5',
          fileId: 'fileId',
          imageId: 'imageId',
          comment: 'comment'
        });
      });

      describe('when post succeeds', function(){
        beforeEach(function(){
          deferredPost.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when post fails', function(){
        beforeEach(function(){
          deferredPost.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling postToBacklog', function(){
      var success;
      var error;
      var deferredPost;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        $scope.model.committedChannel = { channelId: '5' };
        $scope.model.input.fileId = 'fileId';
        $scope.model.input.imageId = 'imageId';
        $scope.model.input.comment = 'comment';
        $scope.model.input.date = 'date';
        $scope.model.input.selectedQueue = { queueId: 'queueId' };

        deferredPost = $q.defer();
        spyOn(target.internal, 'post').and.returnValue(deferredPost.promise);
      });

      describe('when posting to queue', function(){
        beforeEach(function(){
          $scope.model.postToQueue = true;

          $scope.postToBacklog().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call post', function(){
          expect(target.internal.post).toHaveBeenCalledWith({
            channelId: '5',
            fileId: 'fileId',
            imageId: 'imageId',
            comment: 'comment',
            scheduledPostTime: undefined,
            queueId: 'queueId'
          });
        });

        describe('when post succeeds', function(){
          beforeEach(function(){
            deferredPost.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when post fails', function(){
          beforeEach(function(){
            deferredPost.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when not posting to queue', function(){
        beforeEach(function(){
          $scope.model.postToQueue = false;

          $scope.postToBacklog().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call post', function(){
          expect(target.internal.post).toHaveBeenCalledWith({
            channelId: '5',
            fileId: 'fileId',
            imageId: 'imageId',
            comment: 'comment',
            scheduledPostTime: 'date',
            queueId: undefined
          });
        });

        describe('when post succeeds', function(){
          beforeEach(function(){
            deferredPost.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when post fails', function(){
          beforeEach(function(){
            deferredPost.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('when postLater is called', function(){
      beforeEach(function(){
        spyOn($scope, '$watch').and.callThrough();
        $scope.postLater();
      });

      it('should set postLater to true', function(){
        expect($scope.model.postLater).toBe(true);
      });

      it('should set call updateEstimatedLiveDate', function(){
        expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
      });

      it('should set up a watch on the selected date', function(){
        expect($scope.$watch).toHaveBeenCalledWith('model.input.date', jasmine.any(Function));
      });

      it('should set up a watch on the selected queue', function(){
        expect($scope.$watch).toHaveBeenCalledWith('model.input.selectedQueue', jasmine.any(Function));
      });

      it('should assign cancelWatch', function(){
        expect(target.internal.cancelWatch).toBeDefined();
      });

      it('should set postToQueue to false if the date changes', function(){
        var delegate = $scope.$watch.calls.argsFor(0)[1];
        $scope.model.postToQueue = true;
        delegate(1, 1);
        expect($scope.model.postToQueue).toBe(true);
        delegate(1, 2);
        expect($scope.model.postToQueue).toBe(false);
      });

      it('should set postToQueue to true and update estimated live date if the date changes', function(){
        var delegate = $scope.$watch.calls.argsFor(1)[1];
        $scope.model.postToQueue = false;
        delegate(1, 1);
        expect($scope.model.postToQueue).toBe(false);
        delegate(1, 2);
        expect($scope.model.postToQueue).toBe(true);

        expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
      });
    });

    describe('when cancelPostLater is called', function(){
      var cancelWatch;
      beforeEach(function(){
        target.internal.cancelWatch =
          cancelWatch = jasmine.createSpy('cancelWatch');

        $scope.model.postLater = true;

        $scope.cancelPostLater();
      });

      it('should set postLater to false', function(){
        expect($scope.model.postLater).toBe(false);
      });

      it('should cancel the watch', function(){
        expect(cancelWatch).toHaveBeenCalledWith();
      });

      it('should clear the cancelWatch delegate', function(){
        expect(target.internal.cancelWatch).toBeUndefined();
      });
    });
  });
});
