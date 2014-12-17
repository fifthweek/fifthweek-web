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

    // Angulartics mutates property bags you pass to it (ooh-err), so instantiating new instances
    // is vital, otherwise 'submission events' get sent as 'user data', which would be a bug.
    var profileData = function() {
      return {
        'example work': $scope.registrationData.exampleWork,
        'email address': $scope.registrationData.email,
        'username': $scope.registrationData.username
      };
    };

    var applyCategory = function(analyticsEvent) {
      analyticsEvent.category = 'Registration';
      return analyticsEvent;
    };
    var handleSubmissionError = function(errorMessage){
      var failureEvent = { 'error message': errorMessage };
      $analytics.eventTrack('Registration failed', applyCategory(failureEvent));
      $scope.message = errorMessage;
    };

    $analytics.eventTrack('Submitted registration', applyCategory(profileData()));

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
            $analytics.setUserProperties(profileData());
            $analytics.eventTrack('Registration successful', applyCategory({}));
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
