angular.module('webApp').factory('composeUploadDelegate', function($state, composeUtilities) {
    'use strict';

    var service = {};

    service.initialize = function($scope, onUploadComplete, post){
      var model = {
        fileUploaded: false,
        postLater: false,
        postToQueue: true,
        queuedLiveDate: undefined,
        createCollection: false,
        committedCollection: undefined,
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

      var onSuccessfullyPosted = function() {
        // Ensures post appears on current view (live posts / scheduled) if posted to current view.
        // Oddly this does not hide the modal, which is actually what we want!
        $state.reload();
        $scope.$close();
      };

      var cancelWatch;

      $scope.commitCollection = function(){
        return composeUtilities.getCommittedCollection(model)
          .then(function(data){
            model.committedCollection = data;
          });
      };

      $scope.postLater = function() {
        model.postLater = true;
        composeUtilities.updateEstimatedLiveDate(model);
        cancelWatch = $scope.$watch('model.input.date', function(newValue, oldValue){
          if(newValue !==  oldValue){
            model.postToQueue = false;
          }
        });
      };

      $scope.cancelPostLater = function() {
        model.postLater = false;
        cancelWatch();
        cancelWatch = undefined;
      };

      $scope.createNewCollection = function(){
        composeUtilities.showCreateCollectionDialog($scope);
      };

      $scope.shouldCreateCollection = function(){
        return composeUtilities.shouldCreateCollection($scope.model);
      };

      $scope.postNow = function() {
        var data = {
          collectionId: model.committedCollection.collectionId,
          fileId: model.input.fileId,
          comment: model.input.comment,
          isQueued: false
        };

        return post(data)
          .then(function(){
            onSuccessfullyPosted();
          });
      };

      $scope.postToBacklog = function() {
        var data = {
          collectionId: model.committedCollection.collectionId,
          fileId: model.input.fileId,
          comment: model.input.comment,
          isQueued: model.postToQueue,
          scheduledPostTime: model.postToQueue ? undefined : model.input.date
        };

        return post(data)
          .then(function(){
            onSuccessfullyPosted();
          });
      };

    };

    return service;
  }
);
