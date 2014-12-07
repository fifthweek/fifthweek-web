angular.module('webApp').controller(
  'IndexCtrl', ['$scope', '$location', 'authenticationService', 'fifthweekConstants',
  function($scope, $location, authenticationService, fifthweekConstants) {
    'use strict';

    $scope.signOut = function() {
      authenticationService.signOut();
      $location.path(fifthweekConstants.homePage);
    };

    $scope.currentUser = authenticationService.currentUser;
  }
]);
