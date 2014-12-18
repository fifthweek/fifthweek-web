angular.module('webApp').controller('RegisterCtrl', function($scope, $location, $analytics, authenticationService, fifthweekConstants) {
  'use strict';

  if(authenticationService.currentUser.authenticated === true){
    $location.path(fifthweekConstants.dashboardPage);
  }

  $scope.savedSuccessfully = false;
  $scope.message = '';

  $scope.registrationData = {
    exampleWork: '',
    email: '',
    username: '',
    password: ''
  };

  $scope.register = function() {
    var eventCategory = function() { return {category: 'Registration'}; };
    var handleSubmissionError = function(errorMessage){
      $analytics.eventTrack('Registration failed', eventCategory());
      $scope.message = errorMessage;
    };

    $analytics.eventTrack('Registration submitted', eventCategory());

    authenticationService.registerUser($scope.registrationData).then(
      function() {
        $scope.savedSuccessfully = true;
        $scope.message = 'Signing in...';

        var signInData = {
          username: $scope.registrationData.username,
          password: $scope.registrationData.password
        };

        return authenticationService.signIn(signInData).then(
          function() {
            $analytics.eventTrack('Registration succeeded', eventCategory());
            $location.path(fifthweekConstants.dashboardPage);
          },
          function(err) {
            handleSubmissionError(err.error_description);
          }
        );
      },
      function(response) {
        handleSubmissionError(response.data.message);
      });
  };
});
