angular.module('webApp').controller('newQueueCtrl', function($scope, $state, states, queueService, blogRepositoryFactory) {
  'use strict';

  var blogRepository = blogRepositoryFactory.forCurrentUser();

  $scope.previousState = states.creator.queues.name;

  $scope.model = {
    queue: {
      name: ''
    }
  };

  $scope.createQueue = function() {
    var queueName = $scope.model.queue.name;
    return queueService.createQueueFromName(queueName, blogRepository).then(function() {
      $state.go($scope.previousState);
    });
  };
});
