angular.module('webApp').controller('HomeCtrl',
  function($scope, $state, $location, $analytics, authenticationService, fifthweekConstants, logService, utilities) {
  'use strict';

  
  if(authenticationService.currentUser.authenticated === true){
    $state.go('dashboard.demo');
  }

  $scope.savedSuccessfully = false;
  $scope.message = '';

  $scope.registrationData = {
    email: '',
    username: '',
    password: ''
  };

  $scope.register = function() {

    var eventCategory = function() {
      return {category: 'Registration'};
    };

    var handleSubmissionError = function(errorMessage){
      $analytics.eventTrack('Registration failed', eventCategory());
      $scope.message = errorMessage;
    };

    $analytics.eventTrack('Registration submitted', eventCategory());

    return authenticationService.registerUser($scope.registrationData).then(function() {
      $scope.savedSuccessfully = true;
      $scope.message = 'Signing in...';

      var signInData = {
        username: $scope.registrationData.username,
        password: $scope.registrationData.password
      };

      return authenticationService.signIn(signInData).then(function() {
        $analytics.eventTrack('Registration succeeded', eventCategory());
        $state.go('dashboard.demo');
      });
    }).catch(function(error) {
      handleSubmissionError(utilities.getFriendlyErrorMessage(error));
      return logService.error(error);
    });
  };
});
