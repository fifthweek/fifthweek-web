angular.module('webApp').controller('listCollectionsCtrl', function($scope, blogRepositoryFactory, errorFacade, releaseTimeFormatter) {
  'use strict';

  var blogRepository = blogRepositoryFactory.forCurrentUser();
  $scope.model = {};

  blogRepository.getChannels()
    .then(function(channels) {
      $scope.model.collections = _.chain(channels)
        .map(function(channel) {
          return _.map(channel.collections, function(collection) {
            return {
              id: collection.collectionId,
              name: collection.name,
              channel: channel.name,
              isDefaultChannel: channel.isDefault,
              schedule: releaseTimeFormatter.getDayAndTimesOfWeek(collection.weeklyReleaseSchedule)
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
