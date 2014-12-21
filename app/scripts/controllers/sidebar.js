angular.module('webApp').controller(
  'SidebarCtrl', ['$scope', 'authenticationService',
  function($scope, authenticationService) {
    'use strict';

    $scope.currentUser = authenticationService.currentUser;
  }
]);
