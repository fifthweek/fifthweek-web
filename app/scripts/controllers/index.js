angular.module('webApp').controller(
  'IndexCtrl',
  function($scope, authenticationService) {
    'use strict';

    $scope.currentUser = authenticationService.currentUser;
  }
);
