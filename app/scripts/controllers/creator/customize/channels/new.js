angular.module('webApp').controller('newChannelCtrl', function($scope, $q, $state, states, aggregateUserState, channelRepositoryFactory, channelStub, subscriptionService) {
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

  $scope.previousState = states.creators.customize.channels.name;

  $scope.create = function() {
    var channel = $scope.model.channel;
    var channelData = {
      subscriptionId: subscriptionService.subscriptionId,
      name: channel.name,
      description: channel.description,
      price: channel.price * 100,
      isVisibleToNonSubscribers: !channel.hidden
    };
    return channelStub.postChannel(channelData)
      .then(function(response) {
        var channelId = response.data;
        channelData.channelId = channelId;
        channelData.priceInUsCentsPerWeek = channelData.price;
        delete channelData.price;

        channelRepository.createChannel(channelData);

        $state.go($scope.previousState);
      });
  };
});
