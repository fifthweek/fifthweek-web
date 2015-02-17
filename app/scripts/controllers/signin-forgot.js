angular.module('webApp').controller('SignInForgotCtrl',
  function($q, $scope, membershipStub) {
    'use strict';

    $scope.passwordResetRequestData = {
      username: '',
      email: ''
    };

    $scope.requestPasswordReset = function() {
      return membershipStub.postPasswordResetRequest($scope.passwordResetRequestData);
    };
  }
);
