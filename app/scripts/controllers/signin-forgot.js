angular.module('webApp').controller('SignInForgotCtrl',
  function($scope) {
    'use strict';

    $scope.passwordResetRequestData = {
      username: '',
      email: ''
    };

    $scope.requestSucceeded = false;

    $scope.setMessage = function(message) {
      $scope.message = message;
    };

    $scope.requestPasswordReset = function() {
      var data = $scope.passwordResetRequestData;
      if (data.username.length + data.email.length === 0) {
        $scope.setMessage('Must provide username or email.');
        return;
      }

      $scope.requestSucceeded = true;
      //return authenticationService.signIn($scope.signInData)
      //  .then(function() {
      //    $state.go(calculatedStates.getDefaultState());
      //  });
    };
  }
);
