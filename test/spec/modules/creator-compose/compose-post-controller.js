describe('compose post controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var composeUtilities;
  var postStub;
  var initializer;
  var blogRepositoryFactory;
  var blogRepository;
  var errorFacade;

  var control;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['reload']);
    postStub = jasmine.createSpyObj('postStub', ['postPost']);
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['updateEstimatedLiveDate']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getChannelsSorted', 'getQueuesSorted']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });

    control = {
      update: jasmine.createSpy('update')
    };

    module('webApp');
    module(function($provide) {
      $provide.value('postStub', postStub);
      $provide.value('$state', $state);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('initializer', initializer);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('errorFacade', errorFacade);
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
      expect($scope.model.input.content).toBeUndefined();
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
      var success;
      var error;
      var deferredGetChannelsSorted;
      var deferredGetQueuesSorted;
      beforeEach(function(){
        spyOn(target.internal, 'watchForBusyBlocks');

        success = undefined;
        error = undefined;

        deferredGetChannelsSorted = $q.defer();
        blogRepository.getChannelsSorted.and.returnValue(deferredGetChannelsSorted.promise);

        deferredGetQueuesSorted = $q.defer();
        blogRepository.getQueuesSorted.and.returnValue(deferredGetQueuesSorted.promise);

        target.internal.initialize().then(function(){ success = true;}, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call watchForBusyBlocks', function(){
        expect(target.internal.watchForBusyBlocks).toHaveBeenCalled();
      });

      it('should call getChannelsSorted', function(){
        expect(blogRepository.getChannelsSorted).toHaveBeenCalled();
      });

      var testGetQueuesSortedResult = function(){

        describe('when getQueuesSorted succeeds with no queues', function(){
          beforeEach(function(){
            $scope.model.postToQueue = true;
            deferredGetQueuesSorted.resolve([]);
            $scope.$apply();
          });

          it('should set the queues', function(){
            expect($scope.model.queues).toEqual([]);
          });

          it('should set postToQueue to be false', function(){
            expect($scope.model.postToQueue).toBe(false);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getQueuesSorted succeeds with multiple queues', function(){
          beforeEach(function(){
            $scope.model.postToQueue = true;
            deferredGetQueuesSorted.resolve(['a', 'b']);
            $scope.$apply();
          });

          it('should set the queues', function(){
            expect($scope.model.queues).toEqual(['a', 'b']);
          });

          it('should set the selected queue', function(){
            expect($scope.model.input.selectedQueue).toEqual('a');
          });

          it('should not set postToQueue to be false', function(){
            expect($scope.model.postToQueue).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getQueuesSorted fails', function(){
          beforeEach(function(){
            deferredGetQueuesSorted.reject('error');
            $scope.$apply();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      };

      describe('when getChannelsSorted succeeds with no channels', function(){
        beforeEach(function(){
          deferredGetChannelsSorted.resolve([]);
          $scope.$apply();
        });

        it('should not set the committedChannel', function(){
          expect($scope.model.committedChannel).toBeUndefined();
        });

        it('should call getQueuesSorted', function(){
          expect(blogRepository.getQueuesSorted).toHaveBeenCalledWith();
        });

        testGetQueuesSortedResult();
      });

      describe('when getChannelsSorted succeeds with one channel', function(){
        beforeEach(function(){
          deferredGetChannelsSorted.resolve([{channelId: 'a'}]);
          $scope.$apply();
        });

        it('should set the committedChannel', function(){
          expect($scope.model.committedChannel).toEqual({ channelId: 'a' });
        });

        it('should call getQueuesSorted', function(){
          expect(blogRepository.getQueuesSorted).toHaveBeenCalledWith();
        });

        testGetQueuesSortedResult();
      });

      describe('when getChannelsSorted succeeds with multiple channels', function(){
        beforeEach(function(){
          deferredGetChannelsSorted.resolve([{channelId: 'a'}, {channelId: 'b'}]);
          $scope.$apply();
        });

        it('should not set the committedChannel', function(){
          expect($scope.model.committedChannel).toBeUndefined();
        });

        it('should call getQueuesSorted', function(){
          expect(blogRepository.getQueuesSorted).toHaveBeenCalledWith();
        });

        testGetQueuesSortedResult();
      });

      describe('when getChannelsSorted fails', function(){
        beforeEach(function(){
          deferredGetChannelsSorted.reject('error');
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

    describe('when calling post', function(){

      describe('when data is complete', function(){
        var success;
        var error;
        var deferredPostPost;
        var data;
        beforeEach(function(){
          success = undefined;
          error = undefined;

          data = { content: 'content' };

          deferredPostPost = $q.defer();
          postStub.postPost.and.returnValue(deferredPostPost.promise);

          $scope.$close = jasmine.createSpy('$close');

          target.internal.post(data).then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call postPost', function(){
          expect(postStub.postPost).toHaveBeenCalledWith(data);
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

      describe('when data is incomplete', function(){
        var success;
        var error;
        var deferredPostPost;
        beforeEach(function(){
          success = undefined;
          error = undefined;

          deferredPostPost = $q.defer();
          postStub.postPost.and.returnValue(deferredPostPost.promise);

          $scope.$close = jasmine.createSpy('$close');

          target.internal.post({content: undefined}).then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should not call postPost', function(){
          expect(postStub.postPost).not.toHaveBeenCalled();
        });

        it('should display an error message', function(){
          expect($scope.model.errorMessage).toBe('Please provide some content.');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when data is undefined', function(){
        var success;
        var error;
        var deferredPostPost;
        beforeEach(function(){
          success = undefined;
          error = undefined;

          deferredPostPost = $q.defer();
          postStub.postPost.and.returnValue(deferredPostPost.promise);

          $scope.$close = jasmine.createSpy('$close');

          target.internal.post(undefined).then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should not call postPost', function(){
          expect(postStub.postPost).not.toHaveBeenCalled();
        });

        it('should display an error message', function(){
          expect($scope.model.errorMessage).toBe('Please provide some content.');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
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

    describe('when calling getPostData', function(){
      it('should return undefined if no content', function(){
        $scope.model.input.content = undefined;
        $scope.model.committedChannel = {channelId: 'channelId'};

        var data = target.internal.getPostData();

        expect(data).toBeUndefined();
      });

      it('should return post data', function(){
        $scope.model.input.content = {
          serializedBlocks: 'serializedBlocks',
          files: [{ fileId: 'fileId1', name: 'a' }, { fileId: 'fileId2', name: 'b'}],
          imageCount: 'imageCount',
          fileCount: 'fileCount',
          videoCount: 'videoCount',
          previewWordCount: 'previewWordCount',
          wordCount: 'wordCount',
          previewText: 'previewText',
          previewImageId: 'previewImageId'
        };
        $scope.model.committedChannel = {channelId: 'channelId'};

        var data = target.internal.getPostData();

        expect(data).toEqual({
          channelId: 'channelId',
          content: 'serializedBlocks',
          fileIds: ['fileId1', 'fileId2'],
          imageCount: 'imageCount',
          fileCount: 'fileCount',
          videoCount: 'videoCount',
          previewWordCount: 'previewWordCount',
          wordCount: 'wordCount',
          previewText: 'previewText',
          previewImageId: 'previewImageId'
        });
      });
    });

    describe('when calling postNow', function(){
      var success;
      var error;
      var deferredPost;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        spyOn(target.internal, 'getPostData').and.returnValue('postData');

        deferredPost = $q.defer();
        spyOn(target.internal, 'post').and.returnValue(deferredPost.promise);

        $scope.postNow().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call post', function(){
        expect(target.internal.post).toHaveBeenCalledWith('postData');
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

        $scope.model.input.date = 'date';
        $scope.model.input.selectedQueue = { queueId: 'queueId' };

        spyOn(target.internal, 'getPostData').and.returnValue({ blah: 'blah' });

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
            blah: 'blah',
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
            blah: 'blah',
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

    describe('when watchForBusyBlocks is called', function(){
      beforeEach(function(){
        spyOn($scope, '$watch').and.callThrough();
        target.internal.watchForBusyBlocks();
      });

      it('should configure the watch', function(){
        expect($scope.$watch).toHaveBeenCalledWith('model.input.content', target.internal.updateIsProcessing);
      });
    });

    describe('when updateIsProcessing is called', function(){
      it('should set isProcessing to false if no content', function(){
        $scope.model.input.content = undefined;
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(false);
      });

      it('should set isProcessing to false if no content', function(){
        $scope.model.input.content = undefined;
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(false);
      });

      it('should set isProcessing to false if no busy blocks', function(){
        $scope.model.input.content = { busyBlockCount: 0 };
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(false);
      });

      it('should set isProcessing to false if one busy block', function(){
        $scope.model.input.content = { busyBlockCount: 1 };
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(true);
      });

      it('should set isProcessing to false if many busy block', function(){
        $scope.model.input.content = { busyBlockCount: 4 };
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(true);
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
