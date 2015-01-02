angular.module('webApp').controller('RegisterCtrl',
  function($scope, $location, $analytics, authenticationService, fifthweekConstants, logService, utilities) {
  'use strict';

  if(authenticationService.currentUser.authenticated === true){
    $location.path(fifthweekConstants.dashboardPage);
  }

  $scope.savedSuccessfully = false;
  $scope.message = '';
  $scope.isSubmitting = false;

  $scope.registrationData = {
    exampleWork: '',
    email: '',
    username: '',
    password: ''
  };

  $scope.register = function() {
    $scope.isSubmitting = true;

    var eventCategory = function() {
      return {category: 'Registration'};
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
        $location.path(fifthweekConstants.dashboardPage);
      });
    }).catch(function(error) {
      $analytics.eventTrack('Registration failed', eventCategory());
      $scope.message = utilities.getFriendlyErrorMessage(error);
      $scope.isSubmitting = false;
      return logService.error(error);
    });
  };
});
