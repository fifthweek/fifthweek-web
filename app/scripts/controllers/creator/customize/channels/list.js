angular.module('webApp').controller('listChannelsCtrl', function($scope, $q, aggregateUserStateUtilities, errorFacade) {
  'use strict';

  $scope.model = {};

  aggregateUserStateUtilities.getChannelsAndCollections()
    .then(function(channels) {
      $scope.model = {
        channels: _.map(channels, function(channel) {
          return {
            id: channel.channelId,
            name: channel.name,
            price: (channel.priceInUsCentsPerWeek / 100).toFixed(2),
            description: channel.description.split('\n')
          };
        })
      };
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });
});