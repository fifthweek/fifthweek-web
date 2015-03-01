angular.module('webApp').controller(
  'composeNoteCtrl',
  function($scope, $state, postsStub, composeService, utilities, logService) {
    'use strict';

    var model = {
      isSubmitted: false,
      postLater: false,
      input: {
        note: '',
        date: ''
      },
      errorMessage: undefined
    };

    $scope.model = model;

    var loadForm = function(){
      composeService.getChannelsForSelection()
        .then(function(channels){
          model.channels = channels;
          model.input.selectedChannel = channels[0];
        })
        .catch(function(error){
          logService.error(error);
          model.errorMessage = utilities.getFriendlyErrorMessage(error);
        });
    };

    loadForm();

    var postNote = function(data){
      return postsStub.postNote(data)
        .then(function(){
          model.submissionSucceeded = true;
        });
    };

    $scope.postNow = function() {
      var data = {
        channelId: model.input.selectedChannel.channelId,
        note: model.input.note
      };

      return postNote(data);
    };

    $scope.postToBacklog = function()
    {
      var data = {
        channelId: model.input.selectedChannel.channelId,
        note: model.input.note,
        scheduledPostTime: model.input.date
      };

      return postNote(data);
    };

    $scope.postLater = function() {
      model.postLater = true;
    };

    $scope.cancelPostLater = function() {
      model.postLater = false;
    };

    $scope.postAnother = function(){
      $state.forceReload();
    }
  }
);
