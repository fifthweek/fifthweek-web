angular.module('webApp').controller(
  'SignInCtrl',
    function($scope, $state, states, authenticationService, logService, utilities) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: ''
      };

      $scope.message = '';
      $scope.isSubmitting = false;

      $scope.signIn = function() {
        $scope.isSubmitting = true;

        return authenticationService.signIn($scope.signInData).then(
          function() {
            $state.go(states.dashboard.demo.name);
          }).catch(function(error) {
            $scope.message = utilities.getFriendlyErrorMessage(error);
            $scope.isSubmitting = false;
            return logService.error(error);
          });
      };
    }
  );
