angular.module('webApp').controller(
  'IndexCtrl', ['$scope', '$location', 'authenticationService',
  function($scope, $location, authenticationService) {
    'use strict';

    $scope.signOut = function() {
      authenticationService.signOut();
      $location.path('/home');
    };

    $scope.currentUser = authenticationService.currentUser;
  }
]);