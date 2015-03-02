angular.module('webApp').controller('composeImageCtrl',
  function($q, $scope, $state, postsStub, collectionStub, composeUtilities, utilities, logService) {
    'use strict';

    var model = {
      submissionSucceeded: false,
      imageUploaded: false,
      postLater: false,
      postToQueue: true,
      createCollection: false,
      input: {
        fileId: undefined,
        comment: '',
        date: '',
        newCollectionName: '',
        selectedCollection: undefined,
        selectedChannel: undefined
      },
      errorMessage: undefined
    };

    $scope.model = model;

    var loadChannelsAndCollections = function(){
      composeUtilities.getChannelsAndCollectionsForSelection()
        .then(function(result){
          model.collections = result.collections;
          model.channels = result.channels;

          model.input.selectedChannel = result.channels[0];

          if (model.collections.length > 0) {
            model.input.selectedCollection = model.collections[0];
          }
          else {
            model.createCollection = true;
          }
        })
        .catch(function(error){
          logService.error(error);
          model.errorMessage = utilities.getFriendlyErrorMessage(error);
        });
    };

    loadChannelsAndCollections();

    $scope.blobImage = {};

    $scope.onUploadComplete = function(data) {
      model.imageUploaded = true;
      model.input.fileId = data.fileId;
      $scope.blobImage.update(data.fileUri, data.containerName);
    };

    var shouldCreateCollection = function(){
      if(model.createCollection) {
        return true;
      }

      return model.input.selectedCollection.isNewCollection;
    };

    var getCollectionId = function(){
      if(shouldCreateCollection()) {
        return collectionStub
          .postCollection({
            channelId: model.input.selectedChannel.channelId,
            name: model.input.newCollectionName
          })
          .then(function(result){
            return result.data;
          });
      }

      return $q.when(model.input.selectedCollection.collectionId);
    };

    var postImage = function(data){
      return postsStub.postImage(data)
        .then(function(){
          model.submissionSucceeded = true;
        });
    };

    $scope.postNow = function() {
      return getCollectionId()
        .then(function(collectionId){
          var data = {
            collectionId: collectionId,
            imageFileId: model.input.fileId,
            comment: model.input.comment,
            isQueued: false
          };

          return postImage(data);
        });
    };

    $scope.postToBacklog = function() {
      return getCollectionId()
        .then(function(collectionId){
          var data = {
            collectionId: collectionId,
            imageFileId: model.input.fileId,
            comment: model.input.comment,
            isQueued: model.postToQueue,
            scheduledPostTime: model.postToQueue ? undefined : model.input.date
          };

          return postImage(data);
        });
    };

    $scope.postLater = function() {
      model.postLater = true;
    };

    $scope.cancelPostLater = function() {
      model.postLater = false;
    };

    $scope.postAnother = function(){
      $state.reload();
    }
  }
);
