angular.module('webApp').controller('newChannelCtrl', function($scope, $q, $state, states, channelRepositoryFactory, channelStub, blogService) {
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

  $scope.previousState = states.creator.channels.name;

  $scope.create = function() {
    var channel = $scope.model.channel;
    var channelData = {
      blogId: blogService.blogId,
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
        delete channelData.blogId;

        return channelRepository.createChannel(channelData).then(function() {
          $state.go($scope.previousState);
        });
      });
  };
});
