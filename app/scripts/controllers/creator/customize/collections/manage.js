angular.module('webApp').controller('manageCollectionCtrl', function($scope, $state, states) {
  'use strict';

  $scope.delete = function() {
    $state.go(states.creators.customize.collections.name);
  };
});
