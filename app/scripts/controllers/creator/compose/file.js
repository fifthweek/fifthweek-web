angular.module('webApp').controller('composeFileCtrl',
  function($q, $scope, $state, postsStub, composeUtilities) {
    'use strict';

    var model = {
      submissionSucceeded: false,
      fileUploaded: false,
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

    $scope.onUploadComplete = function(data) {
      model.fileUploaded = true;
      model.input.fileId = data.fileId;
    };

    var postFile = function(data){
      return postsStub.postFile(data)
        .then(function(){
          model.submissionSucceeded = true;
        });
    };

    $scope.postNow = function() {
      return composeUtilities.getCollectionIdAndCreateCollectionIfRequired(model)
        .then(function(collectionId){
          var data = {
            collectionId: collectionId,
            fileId: model.input.fileId,
            comment: model.input.comment,
            isQueued: false
          };

          return postFile(data);
        });
    };

    $scope.postToBacklog = function() {
      return composeUtilities.getCollectionIdAndCreateCollectionIfRequired(model)
        .then(function(collectionId){
          var data = {
            collectionId: collectionId,
            fileId: model.input.fileId,
            comment: model.input.comment,
            isQueued: model.postToQueue,
            scheduledPostTime: model.postToQueue ? undefined : model.input.date
          };

          return postFile(data);
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
