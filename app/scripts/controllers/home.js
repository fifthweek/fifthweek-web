angular.module('webApp').controller('HomeCtrl',
  function($scope, $state, states, $modal, analytics, authenticationService, logService, utilities) {
  'use strict';

  if(authenticationService.currentUser.authenticated === true){
    $state.go(states.dashboard.demo.name);
  }

  $scope.savedSuccessfully = false;
  $scope.message = '';
  $scope.isSubmitting = false;

  $scope.registrationData = {
    email: '',
    username: '',
    password: ''
  };

  var eventCategory = 'Registration';

  $scope.register = function() {
    $scope.isSubmitting = true;

    analytics.eventTrack('Registration submitted', eventCategory);

    return authenticationService.registerUser($scope.registrationData).then(function() {
      $scope.savedSuccessfully = true;
      $scope.message = 'Signing in...';

      var signInData = {
        username: $scope.registrationData.username,
        password: $scope.registrationData.password
      };

      return authenticationService.signIn(signInData).then(function() {
        analytics.eventTrack('Registration succeeded', eventCategory);
        $state.go(states.dashboard.demo.name);
      });
    }).catch(function(error) {
      analytics.eventTrack('Registration failed', eventCategory);
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
