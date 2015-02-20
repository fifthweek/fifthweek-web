angular.module('webApp').controller('manageCollectionCtrl', function($scope, $state, states) {
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

  $scope.createBreadcrumb = function(title) {
    var result = [
      {
        name: $scope.model.savedName,
        click: $scope.cancelSubAction
      }
    ];

    if (title) {
      result.push({ name: title });
    }

    return result;
  };

  $scope.manageReleaseTime = function(releaseTime) {
    $scope.model.stagedReleaseTime = _.clone(releaseTime);
    $scope.model.selectedReleaseTime = releaseTime;
  };

  $scope.saveReleaseTime = function() {
    _.merge($scope.model.selectedReleaseTime, $scope.model.stagedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };

  $scope.cancelSubAction = function() {
    $scope.model.selectedReleaseTime = null;
    $scope.model.addingReleaseTime = false
  };

  $scope.delete = function() {
    $state.go(states.creators.customize.collections.name);
  };

  $scope.deleteReleaseTime = function() {
    _.remove($scope.model.schedule, $scope.model.selectedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  }
});
