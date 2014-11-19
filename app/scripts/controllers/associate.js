angular.module('webApp').controller(
  'AssociateCtrl', ['$scope', '$location', '$timeout', 'authService',
    function($scope, $location, $timeout, authService) {
      'use strict';

      $scope.savedSuccessfully = false;
      $scope.message = '';

      $scope.registerData = {
        username: authService.externalAuthData.username,
        provider: authService.externalAuthData.provider,
        externalAccessToken: authService.externalAuthData.externalAccessToken
      };

      $scope.registerExternalUser = function() {

        authService.registerExternalUser($scope.registerData).then(
          function() {
            $scope.savedSuccessfully = true;
            $scope.message = 'User has been registered successfully, you will be redicted to orders page in 2 seconds.';
            startTimer();
          },
          function(response) {
            var errors = [];
            for (var key in response.modelState) {
              errors.push(response.modelState[key]);
            }
            $scope.message = 'Failed to register user due to: ' + errors.join(', ');
          });
      };

      var startTimer = function() {
        var timer = $timeout(function() {
          $timeout.cancel(timer);
          $location.path('/orders');
        }, 2000);
      };
    }
  ]);