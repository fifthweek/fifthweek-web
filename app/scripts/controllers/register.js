angular.module('webApp').controller(
  'RegisterCtrl', ['$scope', '$location', 'authenticationService', 'fifthweekConstants',
    function($scope, $location, authenticationService, fifthweekConstants) {
      'use strict';

      if(authenticationService.currentUser.authenticated === true){
        $location.path(fifthweekConstants.dashboardPage);
      }

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

            return authenticationService.signIn(signInData).then(
              function() {
                $location.path(fifthweekConstants.dashboardPage);
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
