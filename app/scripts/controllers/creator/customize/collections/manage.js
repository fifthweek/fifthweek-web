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
  };

  // Some of this complexity could be deferred to the breadcrumb control. However,
  // this will not be possible until we can dynamically generated `data` objects
  // for states, e.g. name of current collection.
  $scope.createBreadcrumb = function(title) {
    var result = [
      {
        name: 'Collections',
        click: function() {
          $state.go(states.creators.customize.collections.name);
        }
      },
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
});
