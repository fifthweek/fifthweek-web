angular.module('webApp').controller(
  'SignInCtrl',
    function($scope, $state, calculatedStates, authenticationService, logService, utilities) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: ''
      };

      $scope.message = '';
      $scope.isSubmitting = false;

      $scope.signIn = function() {
        $scope.isSubmitting = true;

        return authenticationService.signIn($scope.signInData)
          .then(function() {
            $state.go(calculatedStates.getDefaultState());
          })
          .catch(function(error) {
            $scope.message = utilities.getFriendlyErrorMessage(error);
            $scope.isSubmitting = false;
            return logService.error(error);
          });
      };
    }
  );
