describe('compose image controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var composeUtilities;
  var postsStub;
  var collectionStub;
  var logService;
  var utilities;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['reload']);
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['getChannelsAndCollectionsForSelection']);
    postsStub = jasmine.createSpyObj('postsStub', ['postImage']);
    collectionStub = jasmine.createSpyObj('collectionStub', ['postCollection']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('postsStub', postsStub);
      $provide.value('collectionStub', collectionStub);
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
      target = $controller('composeImageCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){

    describe('when initializing the model', function(){
      beforeEach(function(){
        composeUtilities.getChannelsAndCollectionsForSelection.and.returnValue($q.when({ channels: [], collections: []}));
        createController();
      });

      it('should set submissionSucceeded to false', function(){
        expect($scope.model.submissionSucceeded).toBe(false);
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

      it('should set createCollection to false', function(){
        expect($scope.model.createCollection).toBe(false);
      });

      it('should set the error message to undefined', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set blobImage to an empty object', function(){
        expect($scope.blobImage).toEqual({});
      });

      it('should set the inputs to empty', function(){
        expect($scope.model.input.fileId).toBeUndefined();
        expect($scope.model.input.comment).toBe('');
        expect($scope.model.input.date).toBe('');
        expect($scope.model.input.newCollectionName).toBe('');
        expect($scope.model.input.selectedCollection).toBeUndefined();
        expect($scope.model.input.selectedChannel).toBeUndefined();
      });
    });

    describe('when getChannelsAndCollectionsForSelection succeeds', function(){
      var channelsAndCollections;

      beforeEach(function(){
        channelsAndCollections = {channels: [{name: 'a'}, {name: 'b'}], collections: [{name: 'x'}, {name: 'y'}]};
        composeUtilities.getChannelsAndCollectionsForSelection.and.returnValue($q.when(channelsAndCollections));
        createController();
        $scope.$apply();
      });

      it('should populate the channels in the model', function(){
        expect($scope.model.channels).toEqual(channelsAndCollections.channels);
      });

      it('should populate the collections in the model', function(){
        expect($scope.model.collections).toEqual(channelsAndCollections.collections);
      });

      it('should select the first channel', function(){
        expect($scope.model.input.selectedChannel).toEqual(channelsAndCollections.channels[0]);
      });

      it('should select the first collection', function(){
        expect($scope.model.input.selectedCollection).toEqual(channelsAndCollections.collections[0]);
      });

      it('should set createCollection to false', function(){
        expect($scope.model.createCollection).toBe(false);
      });
    });

    describe('when getChannelsAndCollectionsForSelection succeeds with no collections', function(){
      var channelsAndCollections;

      beforeEach(function(){
        channelsAndCollections = {channels: [{name: 'a'}, {name: 'b'}], collections: []};
        composeUtilities.getChannelsAndCollectionsForSelection.and.returnValue($q.when(channelsAndCollections));
        createController();
        $scope.$apply();
      });

      it('should populate the channels in the model', function(){
        expect($scope.model.channels).toEqual(channelsAndCollections.channels);
      });

      it('should populate the collections in the model', function(){
        expect($scope.model.collections).toEqual(channelsAndCollections.collections);
      });

      it('should select the first channel', function(){
        expect($scope.model.input.selectedChannel).toEqual(channelsAndCollections.channels[0]);
      });

      it('should set the selected collection to undefined', function(){
        expect($scope.model.input.selectedCollection).toBeUndefined();
      });

      it('should set createCollection to true', function(){
        expect($scope.model.createCollection).toBe(true);
      });
    });

    describe('when getChannelsAndCollectionsForSelection fails', function(){
      beforeEach(function(){
        composeUtilities.getChannelsAndCollectionsForSelection.and.returnValue($q.reject('error'));
        utilities.getFriendlyErrorMessage.and.returnValue('friendly');
        createController();
        $scope.$apply();
      });

      it('should log the error', function(){
        expect(logService.error).toHaveBeenCalledWith('error');
      });

      it('should display a friendly error message', function(){
        expect($scope.model.errorMessage).toBe('friendly');
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

      composeUtilities.getChannelsAndCollectionsForSelection.and.returnValue($q.when(channelsAndCollections));
      createController();
      $scope.$apply();

      $scope.blobImage = jasmine.createSpyObj('blobImage', ['update']);

      $scope.model.imageUploaded = true;
      $scope.model.input.fileId = 'fileId';
      $scope.model.input.comment = 'comment';
      $scope.model.input.date = 'date';
    });

    describe('when calling postNow', function(){
      describe('when postImage succeeds', function(){
        beforeEach(function(){
          postsStub.postImage.and.returnValue($q.when());
          $scope.postNow();
          $scope.$apply();
        });

        it('should send the data without any date', function(){
          expect(postsStub.postImage.calls.count()).toBe(1);
          expect(postsStub.postImage).toHaveBeenCalledWith({
            collectionId: '3',
            imageFileId: 'fileId',
            comment: 'comment',
            isQueued: false
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        })
      });

      describe('when postImage fails', function(){
        var error;
        beforeEach(function(){
          postsStub.postImage.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling postToBacklog', function(){
      describe('when postImage succeeds', function(){
        beforeEach(function(){
          postsStub.postImage.and.returnValue($q.when());
          $scope.postToBacklog();
          $scope.$apply();
        });

        it('should send the data with a no date and isQueued set to true', function(){
          expect(postsStub.postImage.calls.count()).toBe(1);
          expect(postsStub.postImage).toHaveBeenCalledWith({
            collectionId: '3',
            imageFileId: 'fileId',
            comment: 'comment',
            isQueued: true,
            scheduledPostTime: undefined
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        })
      });

      describe('when postImage fails', function(){
        var error;
        beforeEach(function(){
          postsStub.postImage.and.returnValue($q.reject('error'));
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
        postsStub.postImage.and.returnValue($q.when());
        $scope.postToBacklog();
        $scope.$apply();
      });

      it('should send the data with a date', function(){
        expect(postsStub.postImage.calls.count()).toBe(1);
        expect(postsStub.postImage).toHaveBeenCalledWith({
          collectionId: '3',
          imageFileId: 'fileId',
          comment: 'comment',
          isQueued: false,
          scheduledPostTime: 'date'
        });
      });
    });

    describe('when calling postNow and createCollection is true', function() {
      beforeEach(function(){
        $scope.model.createCollection = true;
        $scope.model.input.newCollectionName = 'newCollection';
        collectionStub.postCollection.and.returnValue($q.when({ data: '123' }));

        postsStub.postImage.and.returnValue($q.when());
        $scope.postNow();
        $scope.$apply();
      });

      it('should create a new collection', function(){
        expect(collectionStub.postCollection.calls.count()).toBe(1);
        expect(collectionStub.postCollection).toHaveBeenCalledWith({
          channelId: '1',
          name: 'newCollection'
        });
      });

      it('should send the data with the new collection id', function(){
        expect(postsStub.postImage.calls.count()).toBe(1);
        expect(postsStub.postImage).toHaveBeenCalledWith({
          collectionId: '123',
          imageFileId: 'fileId',
          comment: 'comment',
          isQueued: false
        });
      });
    });

    describe('when calling postNow and the selected collection is a new collection', function() {
      beforeEach(function(){
        $scope.model.input.selectedCollection = { isNewCollection: true };
        $scope.model.input.newCollectionName = 'newCollection';
        collectionStub.postCollection.and.returnValue($q.when({ data: '123' }));

        postsStub.postImage.and.returnValue($q.when());
        $scope.postNow();
        $scope.$apply();
      });

      it('should create a new collection', function(){
        expect(collectionStub.postCollection.calls.count()).toBe(1);
        expect(collectionStub.postCollection).toHaveBeenCalledWith({
          channelId: '1',
          name: 'newCollection'
        });
      });

      it('should send the data with the new collection id', function(){
        expect(postsStub.postImage.calls.count()).toBe(1);
        expect(postsStub.postImage).toHaveBeenCalledWith({
          collectionId: '123',
          imageFileId: 'fileId',
          comment: 'comment',
          isQueued: false
        });
      });
    });

    describe('when calling postToBacklog and createCollection is true', function() {
      beforeEach(function(){
        $scope.model.createCollection = true;
        $scope.model.input.newCollectionName = 'newCollection';
        collectionStub.postCollection.and.returnValue($q.when({ data: '123' }));

        postsStub.postImage.and.returnValue($q.when());
        $scope.postToBacklog();
        $scope.$apply();
      });

      it('should create a new collection', function(){
        expect(collectionStub.postCollection.calls.count()).toBe(1);
        expect(collectionStub.postCollection).toHaveBeenCalledWith({
          channelId: '1',
          name: 'newCollection'
        });
      });

      it('should send the data with the new collection id', function(){
        expect(postsStub.postImage.calls.count()).toBe(1);
        expect(postsStub.postImage).toHaveBeenCalledWith({
          collectionId: '123',
          imageFileId: 'fileId',
          comment: 'comment',
          isQueued: true,
          scheduledPostTime: undefined
        });
      });
    });

    describe('when calling postToBacklog and the selected collection is a new collection', function() {
      beforeEach(function(){
        $scope.model.input.selectedCollection = { isNewCollection: true };
        $scope.model.input.newCollectionName = 'newCollection';
        collectionStub.postCollection.and.returnValue($q.when({ data: '123' }));

        postsStub.postImage.and.returnValue($q.when());
        $scope.postToBacklog();
        $scope.$apply();
      });

      it('should create a new collection', function(){
        expect(collectionStub.postCollection.calls.count()).toBe(1);
        expect(collectionStub.postCollection).toHaveBeenCalledWith({
          channelId: '1',
          name: 'newCollection'
        });
      });

      it('should send the data with the new collection id', function(){
        expect(postsStub.postImage.calls.count()).toBe(1);
        expect(postsStub.postImage).toHaveBeenCalledWith({
          collectionId: '123',
          imageFileId: 'fileId',
          comment: 'comment',
          isQueued: true,
          scheduledPostTime: undefined
        });
      });
    });

    describe('when postLater is called', function(){
      beforeEach(function(){
        $scope.postLater();
      });

      it('should set postLater to true', function(){
        expect($scope.model.postLater).toBe(true);
      });
    });

    describe('when cancelPostLater is called', function(){
      beforeEach(function(){
        $scope.cancelPostLater();
      });

      it('should set postLater to false', function(){
        expect($scope.model.postLater).toBe(false);
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
      beforeEach(function(){
        $scope.model.imageUploaded = false;
        $scope.onUploadComplete({fileId: 'fileId2', fileUri: 'uri', containerName: 'containerName'});
      });

      it('should set imageUploaded to true', function(){
        expect($scope.model.imageUploaded).toBe(true);
      });

      it('should set fileId to the new fileId', function(){
        expect($scope.model.input.fileId).toBe('fileId2');
      });

      it('should call blobImage.update with the uri and container name', function(){
        expect($scope.blobImage.update).toHaveBeenCalledWith('uri', 'containerName');
      });
    });
  });
});
