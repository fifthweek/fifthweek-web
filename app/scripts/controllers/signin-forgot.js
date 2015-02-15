angular.module('webApp').controller('SignInForgotCtrl',
  function($q, $scope, membershipStub) {
    'use strict';

    $scope.passwordResetRequestData = {
      username: '',
      email: ''
    };

    $scope.setMessage = function(message) {
      $scope.message = message;
    };

    $scope.requestPasswordReset = function() {
      var data = $scope.passwordResetRequestData;
      if (data.username.length + data.email.length === 0) {
        return $q.reject(new InputValidationError('Must provide username or email.'));
      }

      return membershipStub.postPasswordResetRequest($scope.passwordResetRequestData);
    };
  }
);
