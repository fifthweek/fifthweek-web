angular.module('webApp').controller(
  'RegisterCtrl', ['$scope', '$location', 'authService',
    function($scope, $location, authService) {
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
            $scope.message = 'You have been successfully registered. We will let you know as soon as you can sign in with your account.';
          },
          function(response) {
            var errors = [];
            for (var key in response.data.modelState) {
              for (var i = 0; i < response.data.modelState[key].length; i++) {
                errors.push(response.data.modelState[key][i]);
              }
            }
            $scope.message = errors.join('<br/>');
          });
      };
    }
  ]);