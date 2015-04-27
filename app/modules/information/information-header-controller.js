angular.module('webApp').controller('informationHeaderCtrl',
  function($q, $scope, authenticationService) {
    'use strict';

    $scope.isAuthenticated = authenticationService.currentUser.authenticated;
  }
);
