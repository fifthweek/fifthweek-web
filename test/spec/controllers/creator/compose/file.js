describe('compose file controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var composeUtilities;
  var postsStub;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['reload']);
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['loadChannelsAndCollectionsIntoModel', 'getCollectionIdAndCreateCollectionIfRequired', 'showCreateCollectionDialog']);
    postsStub = jasmine.createSpyObj('postsStub', ['postFile']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('postsStub', postsStub);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('composeFileCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){

    describe('when initializing the model', function(){
      beforeEach(function(){
        createController();
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

      createController();
      $scope.$apply();

      $scope.model.fileUploaded = true;
      $scope.model.input.fileId = 'fileId';
      $scope.model.input.comment = 'comment';
      $scope.model.input.date = 'date';
    });

    describe('when calling postNow', function(){
      describe('when postFile succeeds', function(){
        beforeEach(function(){
          postsStub.postFile.and.returnValue($q.when());
          $scope.postNow();
          $scope.$apply();
        });

        it('should call getCollectionIdAndCreateCollectionIfRequired with the current model', function() {
          expect(composeUtilities.getCollectionIdAndCreateCollectionIfRequired).toHaveBeenCalledWith($scope.model);
        });

        it('should send the data without any date', function(){
          expect(postsStub.postFile.calls.count()).toBe(1);
          expect(postsStub.postFile).toHaveBeenCalledWith({
            collectionId: '5',
            fileId: 'fileId',
            comment: 'comment',
            isQueued: false
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        })
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
          postsStub.postFile.and.returnValue($q.reject('error'));
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
          postsStub.postFile.and.returnValue($q.when());
          $scope.postToBacklog();
          $scope.$apply();
        });

        it('should call getCollectionIdAndCreateCollectionIfRequired with the current model', function() {
          expect(composeUtilities.getCollectionIdAndCreateCollectionIfRequired).toHaveBeenCalledWith($scope.model);
        });

        it('should send the data with a no date and isQueued set to true', function(){
          expect(postsStub.postFile.calls.count()).toBe(1);
          expect(postsStub.postFile).toHaveBeenCalledWith({
            collectionId: '5',
            fileId: 'fileId',
            comment: 'comment',
            isQueued: true,
            scheduledPostTime: undefined
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        })
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
          postsStub.postFile.and.returnValue($q.reject('error'));
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
        postsStub.postFile.and.returnValue($q.when());
        $scope.postToBacklog();
        $scope.$apply();
      });

      it('should send the data with a date', function(){
        expect(postsStub.postFile.calls.count()).toBe(1);
        expect(postsStub.postFile).toHaveBeenCalledWith({
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
        $scope.model.fileUploaded = false;
        $scope.onUploadComplete({fileId: 'fileId2', fileUri: 'uri', containerName: 'containerName'});
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
