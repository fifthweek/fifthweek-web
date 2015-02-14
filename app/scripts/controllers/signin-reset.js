angular.module('webApp').controller('SignInResetCtrl',
  function($scope) {
    'use strict';

    $scope.passwordResetConfirmationData = {
      password: ''
    };

    $scope.resetSucceeded = false;

    $scope.setMessage = function(message) {
      $scope.message = message;
    };

    $scope.confirmPasswordReset = function() {
      $scope.resetSucceeded = true;
    };
  }
);
