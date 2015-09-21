angular.module('webApp').controller('editQueueCtrl', function(
  $scope,
  $state,
  states,
  queueService,
  blogRepositoryFactory,
  releaseTimeFormatter,
  errorFacade) {
  'use strict';

  var queueId = $state.params.id;
  var blogRepository = blogRepositoryFactory.forCurrentUser();
  var defaultHourOfWeek = 0;
  var sortReleaseTimes = function() {
    $scope.model.schedule = _.sortBy($scope.model.schedule, 'sortKey');
  };

  $scope.previousState = states.creator.queues.name;
  $scope.model = {
    releaseTimesDirty: false,
    hourOfWeek: defaultHourOfWeek
  };

  blogRepository.getQueues()
    .then(function(queues) {
      var queue = _.find(queues, { queueId: queueId });
      $scope.model.savedName = queue.name;
      $scope.model.name = queue.name;
      $scope.model.schedule = releaseTimeFormatter.getDayAndTimesOfWeek(queue.weeklyReleaseSchedule);
      sortReleaseTimes();
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });

  $scope.mainFormDirty = function() {
    return $scope.manageQueueForm.$dirty || $scope.model.releaseTimesDirty;
  };

  $scope.addReleaseTime = function() {
    $scope.model.addingReleaseTime = true;
    $scope.model.hourOfWeek = defaultHourOfWeek;
  };

  $scope.manageReleaseTime = function(releaseTime) {
    $scope.model.selectedReleaseTime = releaseTime;
    $scope.model.hourOfWeek = releaseTime.hourOfWeek;
  };

  $scope.saveReleaseTime = function() {
    $scope.model.releaseTimesDirty = true;

    var releaseTime = releaseTimeFormatter.getDayAndTimeOfWeek($scope.model.hourOfWeek);
    _.merge($scope.model.selectedReleaseTime, releaseTime);
    $scope.model.selectedReleaseTime = null;
    sortReleaseTimes();
  };

  $scope.saveNewReleaseTime = function() {
    $scope.model.releaseTimesDirty = true;

    var releaseTime = releaseTimeFormatter.getDayAndTimeOfWeek($scope.model.hourOfWeek);
    $scope.model.schedule.push(releaseTime);
    $scope.model.addingReleaseTime = false;
    sortReleaseTimes();
  };

  $scope.save = function() {
    var queueData = {
      name: $scope.model.name,
      weeklyReleaseSchedule: _.pluck($scope.model.schedule, 'hourOfWeek')
    };

    return queueService.updateQueue(queueId, queueData, blogRepository).then(function() {
      $state.go($scope.previousState);
    });
  };

  $scope.delete = function() {
    return queueService.deleteQueue(queueId, blogRepository).then(function() {
      $state.go($scope.previousState);
    });
  };

  $scope.deleteReleaseTime = function() {
    $scope.model.releaseTimesDirty = true;

    _.remove($scope.model.schedule, $scope.model.selectedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };
});
