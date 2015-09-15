angular.module('webApp').controller('newQueueCtrl', function($scope, $state, states, queueService) {
  'use strict';

  $scope.previousState = states.creator.queues.name;

  $scope.model = {
    queue: {
      name: ''
    }
  };

  $scope.createQueue = function() {
    var queueName = $scope.model.queue.name;
    return queueService.createQueueFromName(queueName).then(function() {
      $state.go($scope.previousState);
    });
  };
});
