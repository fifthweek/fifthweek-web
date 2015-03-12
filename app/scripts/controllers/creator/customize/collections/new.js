angular.module('webApp').controller('newCollectionCtrl', function($scope, $state, states, channelRepositoryFactory, collectionService, channelNameFormatter, errorFacade) {
  'use strict';

  $scope.previousState = states.creators.customize.collections.name;

  $scope.model = {
    collection: {
      name: ''
    }
  };

  var channelRepository = channelRepositoryFactory.forCurrentUser();

  channelRepository.getChannels()
    .then(function(channels) {
      $scope.model.channels = _.map(
        channels,
        function(channel) {
          return {
            value: channel.channelId,
            name: channelNameFormatter.shareWith(channel)
          };
        }
      );

      $scope.model.selectedChannel = $scope.model.channels[0];
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });

  $scope.createCollection = function() {
    var channelId = $scope.model.selectedChannel.value;
    var collectionName = $scope.model.collection.name;
    collectionService.createCollectionFromName(channelId, collectionName).then(function() {
      $state.go($scope.previousState);
    });
  };
});
