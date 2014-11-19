angular.module('webApp').controller(
  'RegisterCtrl', ['$scope', '$location', '$timeout', 'authService',
    function($scope, $location, $timeout, authService) {
      'use strict';

      $scope.savedSuccessfully = false;
      $scope.message = '';

      $scope.registrationData = {
        username: '',
        password: '',
        confirmPassword: ''
      };

      $scope.register = function() {

        authService.registerInternalUser($scope.registrationData).then(
          function() {
            $scope.savedSuccessfully = true;
            $scope.message = 'User has been registered successfully, you will be redicted to the sign in page in 2 seconds.';
            startTimer();
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

      var startTimer = function() {
        var timer = $timeout(function() {
          $timeout.cancel(timer);
          $location.path('/signin');
        }, 2000);
      };

    }
  ]);