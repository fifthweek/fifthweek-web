angular.module('webApp').controller('composeImageCtrl',
  function($q, $scope, $state, postsStub, composeUtilities, blobImageControlFactory) {
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

    composeUtilities.loadChannelsAndCollectionsIntoModel(model);

    $scope.blobImage = blobImageControlFactory.createControl();

    $scope.onUploadComplete = function(data) {
      model.imageUploaded = true;
      model.input.fileId = data.fileId;
      $scope.blobImage.update(data.fileUri, data.containerName);
    };

    var postImage = function(data){
      return postsStub.postImage(data)
        .then(function(){
          model.submissionSucceeded = true;
        });
    };

    $scope.postNow = function() {
      return composeUtilities.getCollectionIdAndCreateCollectionIfRequired(model)
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
      return composeUtilities.getCollectionIdAndCreateCollectionIfRequired(model)
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
    };

    $scope.createNewCollection = function(){
      composeUtilities.showCreateCollectionDialog($scope);
    };
  }
);
