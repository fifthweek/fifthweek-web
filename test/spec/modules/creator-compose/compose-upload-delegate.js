describe('compose upload delegate', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var composeUtilities;
  var onUploadComplete;
  var post;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['reload']);
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['loadChannelsAndCollectionsIntoModel', 'getCollectionIdAndCreateCollectionIfRequired', 'showCreateCollectionDialog', 'updateEstimatedLiveDate']);

    onUploadComplete = jasmine.createSpy('onUploadComplete');
    post = jasmine.createSpy('post');

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('composeUtilities', composeUtilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      target = $injector.get('composeUploadDelegate');
    });
  });

  var initializeTarget = function(){
    target.initialize($scope, onUploadComplete, post);
  };

  describe('when creating', function(){

    describe('when initializing the model', function(){
      beforeEach(function(){
        initializeTarget();
      });

      it('should set submissionSucceeded to false', function(){
        expect($scope.model.submissionSucceeded).toBe(false);
      });

      it('should set fileUploaded to false', function(){
        expect($scope.model.fileUploaded).toBe(false);
      });

      it('should set postLater to false', function(){
        expect($scope.model.postLater).toBe(false);
      });

      it('should set postToQueue to true', function(){
        expect($scope.model.postToQueue).toBe(true);
      });

      it('should set createCollection to false', function(){
        expect($scope.model.createCollection).toBe(false);
      });

      it('should set the error message to undefined', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set the inputs to empty', function(){
        expect($scope.model.input.fileId).toBeUndefined();
        expect($scope.model.input.comment).toBe('');
        expect($scope.model.input.date).toBe('');
        expect($scope.model.input.newCollectionName).toBe('');
        expect($scope.model.input.selectedCollection).toBeUndefined();
        expect($scope.model.input.selectedChannel).toBeUndefined();
      });

      it('should load channels and collections into the model', function(){
        expect(composeUtilities.loadChannelsAndCollectionsIntoModel).toHaveBeenCalledWith($scope.model);
      });

      it('should add an required functions to the scope', function(){
        expect(_.isFunction($scope.onUploadComplete)).toBe(true);
        expect(_.isFunction($scope.postLater)).toBe(true);
        expect(_.isFunction($scope.cancelPostLater)).toBe(true);
        expect(_.isFunction($scope.postAnother)).toBe(true);
        expect(_.isFunction($scope.createNewCollection)).toBe(true);
        expect(_.isFunction($scope.postNow)).toBe(true);
        expect(_.isFunction($scope.postToBacklog)).toBe(true);
      });
    });
  });

  describe('when created', function(){
    var channelsAndCollections;

    beforeEach(function(){
      channelsAndCollections = {
        channels: [{name: 'a', channelId: '1'}, {name: 'b', channelId: '2'}],
        collections: [{name: 'x', collectionId: '3'}, {name: 'y', collectionId: '4'}]
      };

      composeUtilities.loadChannelsAndCollectionsIntoModel.and.callFake(function(){
        $scope.model.channels = channelsAndCollections.channels;
        $scope.model.collections = channelsAndCollections.collections;
        $scope.model.input.selectedChannel = $scope.model.channels[0];
        $scope.model.input.selectedCollection = $scope.model.collections[0];
      });

      composeUtilities.getCollectionIdAndCreateCollectionIfRequired.and.returnValue($q.when('5'));

      initializeTarget();
      $scope.$apply();

      $scope.model.fileUploaded = true;
      $scope.model.input.fileId = 'fileId';
      $scope.model.input.comment = 'comment';
      $scope.model.input.date = 'date';
    });

    describe('when calling postNow', function(){
      describe('when postFile succeeds', function(){
        beforeEach(function(){
          post.and.returnValue($q.when());
          $scope.postNow();
          $scope.$apply();
        });

        it('should call getCollectionIdAndCreateCollectionIfRequired with the current model', function() {
          expect(composeUtilities.getCollectionIdAndCreateCollectionIfRequired).toHaveBeenCalledWith($scope.model);
        });

        it('should send the data without any date', function(){
          expect(post.calls.count()).toBe(1);
          expect(post).toHaveBeenCalledWith({
            collectionId: '5',
            fileId: 'fileId',
            comment: 'comment',
            isQueued: false
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        });
      });

      describe('when getCollectionIdAndCreateCollectionIfRequired fails', function(){
        var error;
        beforeEach(function(){
          composeUtilities.getCollectionIdAndCreateCollectionIfRequired.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });

      describe('when postFile fails', function(){
        var error;
        beforeEach(function(){
          post.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling postToBacklog', function(){
      describe('when postFile succeeds', function(){
        beforeEach(function(){
          post.and.returnValue($q.when());
          $scope.postToBacklog();
          $scope.$apply();
        });

        it('should call getCollectionIdAndCreateCollectionIfRequired with the current model', function() {
          expect(composeUtilities.getCollectionIdAndCreateCollectionIfRequired).toHaveBeenCalledWith($scope.model);
        });

        it('should send the data with a no date and isQueued set to true', function(){
          expect(post.calls.count()).toBe(1);
          expect(post).toHaveBeenCalledWith({
            collectionId: '5',
            fileId: 'fileId',
            comment: 'comment',
            isQueued: true,
            scheduledPostTime: undefined
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        });
      });

      describe('when getCollectionIdAndCreateCollectionIfRequired fails', function(){
        var error;
        beforeEach(function(){
          composeUtilities.getCollectionIdAndCreateCollectionIfRequired.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });

      describe('when postFile fails', function(){
        var error;
        beforeEach(function(){
          post.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling postToBacklog and postToQueue is false', function() {
      beforeEach(function(){
        $scope.model.postToQueue = false;
        post.and.returnValue($q.when());
        $scope.postToBacklog();
        $scope.$apply();
      });

      it('should send the data with a date', function(){
        expect(post.calls.count()).toBe(1);
        expect(post).toHaveBeenCalledWith({
          collectionId: '5',
          fileId: 'fileId',
          comment: 'comment',
          isQueued: false,
          scheduledPostTime: 'date'
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
        expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalled();
      });

      it('should set up a watch on the selected date', function(){
        expect($scope.$watch).toHaveBeenCalledWith('model.input.date', jasmine.any(Function));
      });

      it('should set postToQueue to false if the date changes', function(){
        var delegate = $scope.$watch.calls.first().args[1];
        $scope.model.postToQueue = true;
        delegate(1, 2);
        expect($scope.model.postToQueue).toBe(false);
      });
    });

    describe('when cancelPostLater is called', function(){
      var cancelCalled;
      beforeEach(function(){
        cancelCalled = false;
        spyOn($scope, '$watch').and.returnValue(function(){
          cancelCalled = true;
        });
        $scope.postLater();
        expect(cancelCalled).toBe(false);
        $scope.cancelPostLater();
      });

      it('should set postLater to false', function(){
        expect($scope.model.postLater).toBe(false);
      });

      it('should cancel the watch', function(){
        expect(cancelCalled).toBe(true);
      });
    });

    describe('when postAnother is called', function(){
      beforeEach(function(){
        $scope.postAnother();
      });

      it('should set postLater to false', function(){
        expect($state.reload).toHaveBeenCalled();
      });
    });

    describe('when onUploadComplete is called', function(){
      var data;
      beforeEach(function(){
        data = {fileId: 'fileId2', uri: 'uri', containerName: 'containerName'};
        $scope.model.fileUploaded = false;
        $scope.onUploadComplete(data);
      });

      it('should set fileUploaded to true', function(){
        expect($scope.model.fileUploaded).toBe(true);
      });

      it('should set fileId to the new fileId', function(){
        expect($scope.model.input.fileId).toBe('fileId2');
      });

      it('should call the onUploadComplete delegate', function(){
        expect(onUploadComplete.calls.count()).toBe(1);
        expect(onUploadComplete).toHaveBeenCalledWith(data);
      });
    });

    describe('when onUploadComplete is called and delegate is undefined', function(){
      var data;
      beforeEach(function(){
        onUploadComplete = undefined;
        data = {fileId: 'fileId2', uri: 'uri', containerName: 'containerName'};
        $scope.model.fileUploaded = false;
        $scope.onUploadComplete(data);
      });

      it('should set fileUploaded to true', function(){
        expect($scope.model.fileUploaded).toBe(true);
      });

      it('should set fileId to the new fileId', function(){
        expect($scope.model.input.fileId).toBe('fileId2');
      });
    });
  });
});
