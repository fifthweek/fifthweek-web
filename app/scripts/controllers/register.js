angular.module('webApp').controller(
  'RegisterCtrl', ['$scope', '$location', 'authService', 'webSettings',
    function($scope, $location, authService, webSettings) {
      'use strict';

      $scope.savedSuccessfully = false;
      $scope.message = '';

      $scope.registrationData = {
        email: '',
        username: '',
        password: ''
      };

      $scope.register = function() {

        authService.registerInternalUser($scope.registrationData).then(
          function() {
            $scope.savedSuccessfully = true;
            $scope.message = 'Account Created! Signing in...';

            var signInData = {
              username: $scope.registrationData.username,
              password: $scope.registrationData.password
            };

            authService.signIn(signInData).then(
              function() {
                $location.path(webSettings.successfulSignInPath);
              },
              function(err) {
                $scope.message = err.error_description;
              }
            );
          },
          function(response) {
            $scope.message = response.data.message;
          });
      };
    }
  ]);
