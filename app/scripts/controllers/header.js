angular.module('webApp').controller(
  'HeaderCtrl',
  function($scope, $state, states, authenticationService) {
    'use strict';

    $scope.signOut = function() {
      $state.go(states.signOut.name);
    };

    $scope.currentUser = authenticationService.currentUser;
  }
);
