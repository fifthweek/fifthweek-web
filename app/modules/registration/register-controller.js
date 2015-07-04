angular.module('webApp').controller('RegisterCtrl',
  function($q, $scope, $state, analyticsEventConstants, calculatedStates, authenticationService) {
  'use strict';

    $scope.registrationSucceeded = false;

    $scope.tracking = {
      eventCategory: analyticsEventConstants.registration.category,
      eventTitle: analyticsEventConstants.registration.title
    };

    $scope.registrationData = {
      email: '',
      username: '',
      password: '',
      creatorName: ''
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
          return authenticationService.signIn(signInData);
        })
        .then(function() {
          $state.go(calculatedStates.getDefaultState());
        })
        .catch(function(error){
          $scope.registrationSucceeded = false;
          return $q.reject(error);
        });
    };
});
