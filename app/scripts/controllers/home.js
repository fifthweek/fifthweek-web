angular.module('webApp').controller('HomeCtrl',
  function($scope, $state, calculatedStates, utilities, $modal, analytics, authenticationService, logService) {
  'use strict';

  $scope.isSubmitting = false;
  $scope.submissionSucceeded = false;
  $scope.message = '';

  $scope.registrationData = {
    email: '',
    username: '',
    password: ''
  };

  var eventCategory = 'Registration';
  var eventPrefix = 'Registration';

  $scope.register = function() {
    $scope.isSubmitting = true;
    analytics.eventTrack(eventPrefix + ' submitted', eventCategory);

    return authenticationService.registerUser($scope.registrationData)
      .then(function() {
        $scope.submissionSucceeded = true;
        $scope.message = 'Signing in...';

        var signInData = {
          username: $scope.registrationData.username,
          password: $scope.registrationData.password
        };

        return authenticationService.signIn(signInData).then(function() {
          analytics.eventTrack(eventPrefix + ' succeeded', eventCategory);
          $state.go(calculatedStates.getDefaultState());
        });
      })
      .catch(function(error) {
        analytics.eventTrack(eventPrefix + ' failed', eventCategory);
        $scope.message = utilities.getFriendlyErrorMessage(error);
        $scope.isSubmitting = false;
        return logService.error(error);
      });
  };

  $scope.openModal = function(){
    $modal.open({
      templateUrl: 'views/home-modal.html'
    });
  };
});
