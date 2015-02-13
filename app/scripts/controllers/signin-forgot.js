angular.module('webApp').controller('SignInForgotCtrl',
  function($scope, $state, calculatedStates, authenticationService) {
    'use strict';

    $scope.passwordResetRequestData = {
      username: '',
      email: ''
    };

    $scope.requestPasswordReset = function() {
      var data = $scope.passwordResetRequestData;
      if (data.username.length + data.email.length === 0) {
        $scope.message = 'Must provide username or email.';
      }

      //return authenticationService.signIn($scope.signInData)
      //  .then(function() {
      //    $state.go(calculatedStates.getDefaultState());
      //  });
    };
  }
);
