angular.module('webApp').controller(
  'HeaderCtrl', ['$scope', '$rootScope', '$location', 'authenticationService', 'fifthweekConstants',
  function($scope, $rootScope, $location, authenticationService, fifthweekConstants) {
    'use strict';

    $scope.signOut = function() {
      authenticationService.signOut();
      $location.path(fifthweekConstants.homePage);
    };

    $scope.currentUser = authenticationService.currentUser;
  }
]);
