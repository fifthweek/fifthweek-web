angular.module('webApp').factory('composeUploadDelegate', function($state, composeUtilities) {
    'use strict';

    var service = {};

    service.initialize = function($scope, onUploadComplete, post){
      var model = {
        submissionSucceeded: false,
        fileUploaded: false,
        postLater: false,
        postToQueue: true,
        queuedLiveDate: undefined,
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
        if(onUploadComplete){
          onUploadComplete(data);
        }
      };

      $scope.postLater = function() {
        model.postLater = true;
        composeUtilities.updateEstimatedLiveDate(model);
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

      $scope.shouldCreateCollection = function(){
        return composeUtilities.shouldCreateCollection($scope.model);
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

            return post(data)
              .then(function(){
                model.submissionSucceeded = true;
              });
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

            return post(data)
              .then(function(){
                model.submissionSucceeded = true;
              });
          });
      };

    };

    return service;
  }
);
