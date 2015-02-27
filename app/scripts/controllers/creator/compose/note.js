angular.module('webApp').controller(
  'newNoteCtrl',
  function($scope, aggregateUserState) {
    'use strict';

    var model = {
      postLater: false,
      input: {
        note: '',
        date: ''
      },
      errorMessage: undefined
    };

    $scope.model = model;

    var loadForm = function(){
      var channels = _.clone(aggregateUserState.currentValue.createdChannelsAndCollections.channels);

      // Simulate having no custom channels.
      // channels = [ channels[0] ];

      if(channels.length === 0) {
        model.errorMessage = 'You must create a subscription before posting.';
        return;
      }

      if (channels.length > 1) {
        channels[0].name = 'Share with everyone';
        for(var i = 1; i < channels.length; ++i){
          channels[i].name = '"' + channels[i].name + '" Only';
        }

        model.channels = channels;
        model.input.selectedChannel = channels[0];
      }
    };

    loadForm();

    $scope.postNow = function() { };

    $scope.postToBacklog = function()
    {
      var date = model.input.date;
    };

    $scope.postLater = function() {
      model.postLater = true;
    };

    $scope.cancelPostLater = function() {
      model.postLater = false;
    };
  }
);
