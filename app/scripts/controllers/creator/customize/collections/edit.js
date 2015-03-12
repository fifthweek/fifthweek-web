angular.module('webApp').controller('editCollectionCtrl', function($scope, $state, states, collectionService) {
  'use strict';

  //var channelRepository = channelRepositoryFactory.forCurrentUser();
  var collectionId = $state.params.id;

  $scope.previousState = states.creators.customize.collections.name;

  $scope.model = {
    id: 'a',
    savedName: 'Side Comic',
    name: 'Side Comic',
    releaseTimesDirty: false,
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

  $scope.mainFormDirty = function() {
    return $scope.manageCollectionForm.$dirty || $scope.model.releaseTimesDirty;
  };

  $scope.timeChanged = function() {

  };

  $scope.manageReleaseTime = function(releaseTime) {
    $scope.model.stagedReleaseTime = _.cloneDeep(releaseTime);
    $scope.model.selectedReleaseTime = releaseTime;
  };

  $scope.saveReleaseTime = function() {
    $scope.model.releaseTimesDirty = true;
    _.merge($scope.model.selectedReleaseTime, $scope.model.stagedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };

  $scope.addReleaseTime = function() {
    // To-do: add to release times.
    $scope.model.releaseTimesDirty = true;
    $scope.model.addingReleaseTime = false;
  };

  $scope.save = function() {
    $state.go($scope.previousState);
  };

  $scope.delete = function() {
    return collectionService.deleteCollection(collectionId).then(function() {
      $state.go($scope.previousState);
    });
  };

  $scope.deleteReleaseTime = function() {
    _.remove($scope.model.schedule, $scope.model.selectedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };
});
