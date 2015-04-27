angular.module('webApp').controller('RegisterCtrl',
  function($scope, $state, calculatedStates, $modal, authenticationService) {
  'use strict';

  $scope.registrationSucceeded = false;

  $scope.registrationData = {
    email: '',
    username: '',
    password: ''
  };

  $scope.register = function() {
    return authenticationService.registerUser($scope.registrationData)
      .then(function() {
        $scope.registrationSucceeded = true;
        $scope.form.message = 'Signing in...';

        var signInData = {
          username: $scope.registrationData.username,
          password: $scope.registrationData.password
        };

        return authenticationService.signIn(signInData).then(function() {
          $state.go(calculatedStates.getDefaultState());
        });
      });
  };
});
