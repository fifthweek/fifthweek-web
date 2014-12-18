angular.module('webApp').controller(
  'IndexCtrl', ['$scope', '$rootScope', '$location', 'authenticationService', 'fifthweekConstants',
  function($scope, $rootScope, $location, authenticationService, fifthweekConstants) {
    'use strict';

    $rootScope.secondaryNav = true;

    $scope.signOut = function() {
      authenticationService.signOut();
      $location.path(fifthweekConstants.homePage);
    };

    $scope.currentUser = authenticationService.currentUser;
  }
]);
