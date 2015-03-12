angular.module('webApp').controller('listCollectionsCtrl', function($scope, channelRepositoryFactory, errorFacade, releaseTimeFormatter) {
  'use strict';

  var channelRepository = channelRepositoryFactory.forCurrentUser();
  $scope.model = {};

  channelRepository.getChannels()
    .then(function(channels) {
      $scope.model.collections = _.chain(channels)
        .map(function(channel) {
          return _.map(channel.collections, function(collection) {
            return {
              id: collection.collectionId,
              name: collection.name,
              channel: channel.name,
              isDefaultChannel: channel.isDefault,
              schedule: releaseTimeFormatter.getDaysOfWeek(collection.weeklyReleaseSchedule)
            };
          });
        })
        .flatten()
        .sortBy('name')
        .value();
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });
});
