angular.module('webApp').controller('SignInForgotCtrl',
  function($scope, membershipStub) {
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

      return membershipStub.postPasswordResetRequest($scope.passwordResetRequestData)
        .then(function() {
          $scope.requestSucceeded = true;
        });
    };
  }
);
