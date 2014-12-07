angular.module('webApp').controller(
  'SignInCtrl', ['$scope', '$location', 'authenticationService', 'fifthweekConstants',
    function($scope, $location, authenticationService, fifthweekConstants) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: '',
      };

      $scope.message = '';

      $scope.signIn = function() {
        return authenticationService.signIn($scope.signInData).then(
          function() {
            $location.path(fifthweekConstants.dashboardPage);
          },
          function(err) {
            $scope.message = err.error_description;
          });
      };
    }
  ]);
