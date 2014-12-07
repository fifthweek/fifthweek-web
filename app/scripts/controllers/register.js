angular.module('webApp').controller(
  'RegisterCtrl', ['$scope', '$location', 'authenticationService', 'webSettings',
    function($scope, $location, authenticationService, webSettings) {
      'use strict';

      $scope.savedSuccessfully = false;
      $scope.message = '';

      $scope.registrationData = {
        exampleWork: '',
        email: '',
        username: '',
        password: ''
      };

      $scope.register = function() {

        authenticationService.registerUser($scope.registrationData).then(
          function() {
            $scope.savedSuccessfully = true;
            $scope.message = 'Signing in...';

            var signInData = {
              username: $scope.registrationData.username,
              password: $scope.registrationData.password
            };

            authenticationService.signIn(signInData).then(
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
