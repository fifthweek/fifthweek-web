angular.module('webApp').controller('newCollectionCtrl', function($scope, $state, states) {
  'use strict';

  $scope.model = {
    name: '',
    channels: [
      {
        name:'Share with everyone',
        value:'a'
      },
      {
        name:'"Extras Channel" Only',
        value:'b'
      },
      {
        name:'"HD Channel" Only',
        value:'c'
      }
    ]
  };

  $scope.model.selectedChannel = $scope.model.channels[0];

  $scope.createCollection = function() {
    $state.go(states.creators.customize.collections.name);
  };

  $scope.deleteReleaseTime = function() {
    _.remove($scope.model.schedule, $scope.model.selectedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };
});
