angular.module('webApp').controller(
  'SignInCtrl', ['$scope', '$location', 'authenticationService', 'webSettings',
    function($scope, $location, authenticationService, webSettings) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: '',
      };

      $scope.message = '';

      $scope.signIn = function() {
        return authenticationService.signIn($scope.signInData).then(
          function() {
            $location.path(webSettings.successfulSignInPath);
          },
          function(err) {
            $scope.message = err.error_description;
          });
      };
    }
  ]);
