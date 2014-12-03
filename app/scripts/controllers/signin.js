angular.module('webApp').controller(
  'SignInCtrl', ['$scope', '$location', 'authService', 'webSettings',
    function($scope, $location, authService, webSettings) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: '',
      };

      $scope.message = '';

      $scope.signIn = function() {
        return authService.signIn($scope.signInData).then(
          function() {
            $location.path(webSettings.successfulSignInPath);
          },
          function(err) {
            $scope.message = err.error_description;
          });
      };
    }
  ]);
