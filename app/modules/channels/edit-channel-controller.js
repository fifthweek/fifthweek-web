angular.module('webApp').controller('editChannelCtrl', function($scope, $q, $state, states, channelRepositoryFactory, channelStub, errorFacade) {
  'use strict';

  var channelRepository = channelRepositoryFactory.forCurrentUser();
  var channelId = $state.params.id;
  $scope.previousState = states.creators.channels.name;
  $scope.model = {};

  channelRepository.getChannel(channelId)
    .then(function(channel) {
      $scope.model.savedChannelName = channel.name;
      $scope.model.channel = channel;

      // Map price.
      $scope.model.channel.price = ($scope.model.channel.priceInUsCentsPerWeek / 100).toFixed(2);
      delete $scope.model.channel.priceInUsCentsPerWeek;

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
      description: channel.description,
      price: Math.round(channel.price * 100),
      isVisibleToNonSubscribers: !channel.hidden
    };
    return channelStub.putChannel(channelId, channelData).then(function() {
      return channelRepository.updateChannel(channelId, function(channel) {
        channel.name = channelData.name;
        channel.description = channelData.description;
        channel.priceInUsCentsPerWeek = channelData.price;
        channel.isVisibleToNonSubscribers = channelData.isVisibleToNonSubscribers;
      }).then(function() {
        $state.go($scope.previousState);
      });
    });
  };

  $scope.delete = function() {
    return channelStub.deleteChannel(channelId).then(function() {
      return channelRepository.deleteChannel(channelId).then(function() {
        $state.go($scope.previousState);
      });
    });
  };
});
