angular.module('webApp').controller('SignInResetCtrl',
  function($scope, $state, membershipStub, utilities) {
    'use strict';

    var userId = $state.params.userId;
    var token = $state.params.token;

    $scope.passwordResetConfirmationData = {
      newPassword: '',
      userId: userId,
      token: token
    };

    if (userId === undefined || token === undefined) {
      $scope.tokenInvalid = true;
      return;
    }

    $scope.tokenInvalid = false;
    $scope.resetSucceeded = false;

    $scope.setMessage = function(message) {
      $scope.message = message;
    };

    $scope.confirmPasswordReset = function() {
      return membershipStub.postPasswordResetConfirmation($scope.passwordResetConfirmationData).then(function() {
        $scope.resetSucceeded = true;
      });
    };

    membershipStub.getPasswordResetTokenValidity(userId, token).catch(function(error) {
      if (error instanceof ApiError && error.response.status === 404) {
        $scope.tokenInvalid = true;
      }
      else {
        $scope.setMessage(utilities.getFriendlyErrorMessage(error));
      }
    });
  }
);
