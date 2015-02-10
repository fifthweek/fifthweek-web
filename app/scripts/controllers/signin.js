angular.module('webApp').controller(
  'SignInCtrl',
    function($scope, $state, calculatedStates, authenticationService) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: ''
      };

      $scope.signIn = function() {
        return authenticationService.signIn($scope.signInData)
          .then(function() {
            $state.go(calculatedStates.getDefaultState());
          });
      };
    }
  );
