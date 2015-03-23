angular.module('webApp').controller('listChannelsCtrl', function($scope, channelRepositoryFactory, errorFacade) {
  'use strict';

  var channelRepository = channelRepositoryFactory.forCurrentUser();
  $scope.model = {};

  channelRepository.getChannels()
    .then(function(channels) {
      $scope.model.channels = _.chain(channels)
        .map(function (channel) {
          return {
            id: channel.channelId,
            name: channel.name,
            price: (channel.priceInUsCentsPerWeek / 100).toFixed(2),
            description: channel.description.split('\n'),
            isDefault: channel.isDefault
          };
        })
        .sortByOrder(['isDefault', 'name'], [false, true])
        .value();
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });
});
