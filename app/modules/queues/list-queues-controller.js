angular.module('webApp').controller('listQueuesCtrl', function($scope, blogRepositoryFactory, errorFacade, releaseTimeFormatter) {
  'use strict';

  var blogRepository = blogRepositoryFactory.forCurrentUser();
  $scope.model = {};

  blogRepository.getQueues()
    .then(function(queues) {
      $scope.model.queues = _.chain(queues)
        .map(function(queue) {
          return {
            id: queue.queueId,
            name: queue.name,
            schedule: releaseTimeFormatter.getDayAndTimesOfWeek(queue.weeklyReleaseSchedule)
          };
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
