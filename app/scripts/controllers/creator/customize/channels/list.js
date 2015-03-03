angular.module('webApp').controller('listChannelsCtrl', function($scope, $q, aggregateUserState, errorFacade) {
  'use strict';

  $scope.model = {};

  // Extract into utilities
  var getChannelsAndCollections = function() {
    if(!aggregateUserState.currentValue){
      return $q.reject(new FifthweekError('No aggregate state found.'));
    }

    var channels = aggregateUserState.currentValue.createdChannelsAndCollections.channels;

    if(channels.length === 0) {
      return $q.reject(new DisplayableError('You must create a subscription before posting.'));
    }

    return $q.when(channels);
  };

  getChannelsAndCollections()
    .then(function(channels) {
      $scope.model = {
        channels: _.map(channels, function(channel) {
          return {
            id: channel.channelId,
            name: channel.name || 'Base Channel',
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
