angular.module('webApp').controller('newChannelCtrl', function($scope, $q, $state, states, channelRepositoryFactory, channelStub, subscriptionService) {
  'use strict';

  var channelRepository = channelRepositoryFactory.forCurrentUser();
  $scope.model = {
    channel: {
      name: '',
      description: '',
      hidden: false,
      price: '1.00'
    }
  };

  $scope.previousState = states.creators.subscription.channels.name;

  $scope.create = function() {
    var channel = $scope.model.channel;
    var channelData = {
      subscriptionId: subscriptionService.subscriptionId,
      name: channel.name,
      description: channel.description,
      price: Math.round(channel.price * 100),
      isVisibleToNonSubscribers: !channel.hidden
    };
    return channelStub.postChannel(channelData)
      .then(function(response) {
        var channelId = response.data;
        channelData.collections = [];
        channelData.channelId = channelId;
        channelData.priceInUsCentsPerWeek = channelData.price;
        channelData.isDefault = false;
        delete channelData.price;
        delete channelData.subscriptionId;

        return channelRepository.createChannel(channelData).then(function() {
          $state.go($scope.previousState);
        });
      });
  };
});
