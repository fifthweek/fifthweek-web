angular.module('webApp').controller('SignInForgotCtrl',
  function($scope, $state, calculatedStates, authenticationService) {
    'use strict';

    $scope.passwordResetRequestData = {
      username: '',
      email: ''
    };

    $scope.requestPasswordReset = function() {
      return authenticationService.signIn($scope.signInData)
        .then(function() {
          $state.go(calculatedStates.getDefaultState());
        });
    };
  }
);
