angular.module('webApp').controller('editChannelCtrl', function($scope, $q, $state, states, blogRepositoryFactory, channelStub, errorFacade) {
  'use strict';

  var blogRepository = blogRepositoryFactory.forCurrentUser();
  var channelId = $state.params.id;
  $scope.previousState = states.creator.channels.name;
  $scope.model = {};

  blogRepository.getChannel(channelId)
    .then(function(channel) {
      $scope.model.savedChannelName = channel.name;
      $scope.model.channel = channel;

      // Map price.
      $scope.model.channel.price = ($scope.model.channel.price / 100).toFixed(2);

      // Map visibility.
      $scope.model.channel.hidden = !$scope.model.channel.isVisibleToNonSubscribers;
      delete $scope.model.channel.isVisibleToNonSubscribers;
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });

  $scope.save = function() {
    var channel = $scope.model.channel;
    var channelData = {
      name: channel.name,
      price: Math.round(channel.price * 100),
      isVisibleToNonSubscribers: !channel.hidden
    };
    return channelStub.putChannel(channelId, channelData).then(function() {
      return blogRepository.updateChannel(channelId, function(channel) {
        channel.name = channelData.name;
        channel.price = channelData.price;
        channel.isVisibleToNonSubscribers = channelData.isVisibleToNonSubscribers;
      }).then(function() {
        $state.go($scope.previousState);
      });
    });
  };

  $scope.delete = function() {
    return channelStub.deleteChannel(channelId).then(function() {
      return blogRepository.deleteChannel(channelId).then(function() {
        $state.go($scope.previousState);
      });
    });
  };
});
