angular.module('webApp').controller(
  'SidebarCtrl', ['$scope', '$location', 'authenticationService',
  function($scope, $location, authenticationService) {
    'use strict';

    /*$scope.signOut = function() {
      authenticationService.signOut();
      $location.path(fifthweekConstants.homePage);
    };
    */

    $scope.currentUser = authenticationService.currentUser;
  }
]);
