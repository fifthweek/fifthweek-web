angular.module('webApp').controller('SignInResetCtrl',
  function($scope, $state, membershipStub, errorFacade) {
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

    $scope.confirmPasswordReset = function() {
      return membershipStub.postPasswordResetConfirmation($scope.passwordResetConfirmationData);
    };

    membershipStub.getPasswordResetTokenValidity(userId, token).catch(function(error) {
      if (error instanceof ApiError && error.response.status === 404) {
        $scope.tokenInvalid = true;
      }
      else {
        return errorFacade.handleError(error, function(message) {
          $scope.form.message = message;
        });
      }
    });
  }
);
