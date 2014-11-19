angular.module('webApp').controller(
  'IndexCtrl', ['$scope', '$location', 'authService',
  function($scope, $location, authService) {
    'use strict';

    $scope.signOut = function() {
      authService.signOut();
      $location.path('/home');
    };

    $scope.authentication = authService.authentication;
  }
]);