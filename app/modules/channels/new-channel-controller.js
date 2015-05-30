angular.module('webApp').controller('newChannelCtrl', function($scope, $q, $state, states, channelStub, blogService, fetchAggregateUserState, authenticationService) {
  'use strict';

  $scope.model = {
    channel: {
      name: '',
      description: '',
      hidden: false,
      price: '1.00'
    }
  };

  $scope.previousState = states.creator.channels.name;

  $scope.create = function() {
    var userId = authenticationService.currentUser.userId;
    var channel = $scope.model.channel;
    var channelData = {
      blogId: blogService.blogId,
      name: channel.name,
      description: channel.description,
      price: Math.round(channel.price * 100),
      isVisibleToNonSubscribers: !channel.hidden
    };
    return channelStub.postChannel(channelData)
      .then(function() {
        // Get access signatures for new channel.
        // No need to update local state with new channel as
        // this call will overwrite it.
        return fetchAggregateUserState.updateFromServer(userId);
      })
      .then(function(){
        $state.go($scope.previousState);
      });
  };
});
