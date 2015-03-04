angular.module('webApp').controller('editCollectionCtrl', function($scope, $state, states) {
  'use strict';

  $scope.model = {
    id: 'a',
    savedName: 'Side Comic',
    name: 'Side Comic',
    schedule: [
      {
        id: 1,
        day:'Monday',
        time:'12:00am'
      },
      {
        id: 2,
        day:'Wednesday',
        time:'12:00am'
      },
      {
        id: 3,
        day:'Friday',
        time:'6:00pm'
      }
    ],
    channels: [
      {
        name:'Base Channel',
        value:'a'
      },
      {
        name:'Extras Channel',
        value:'b'
      },
      {
        name:'HD Channel',
        value:'c'
      }
    ]
  };

  $scope.model.selectedChannel = $scope.model.channels[1];

  $scope.timeChanged = function() {

  };

  $scope.manageReleaseTime = function(releaseTime) {
    $scope.model.stagedReleaseTime = _.cloneDeep(releaseTime);
    $scope.model.selectedReleaseTime = releaseTime;
  };

  $scope.saveReleaseTime = function() {
    _.merge($scope.model.selectedReleaseTime, $scope.model.stagedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };

  $scope.addReleaseTime = function() {
    // To-do: add to release times.
    $scope.model.addingReleaseTime = false;
  };

  $scope.save = function() {
    $state.go(states.creators.customize.collections.name);
  };

  $scope.delete = function() {
    $state.go(states.creators.customize.collections.name);
  };

  $scope.deleteReleaseTime = function() {
    _.remove($scope.model.schedule, $scope.model.selectedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };
});
