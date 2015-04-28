angular.module('webApp').controller(
  'signInWorkflowDialogCtrl',
  function($q, $scope, $state, states, authenticationService) {
    'use strict';

    var pages = $scope.pages = {
      register: 0,
      signIn: 1
    };

    $scope.model = {
      page: pages.register
    };

    $scope.registrationData = {
      email: '',
      username: '',
      password: ''
    };

    $scope.signInData = {
      username: '',
      password: ''
    };

    $scope.signIn = function() {
      return authenticationService.signIn( $scope.signInData)
        .then(function() {
          $scope.$close(true);
        });
    };

    $scope.register = function() {
      return authenticationService.registerUser($scope.registrationData)
        .then(function() {
          $scope.signInData.username = $scope.registrationData.username;
          $scope.signInData.password = $scope.registrationData.password;
          return authenticationService.signIn( $scope.signInData).then(function() {
            $scope.$close(true);
          });
        });
    };

    $scope.showSignIn = function(){
      $scope.model.page = pages.signIn;
    };

    $scope.showRegister = function(){
      $scope.model.page = pages.register;
    };

    $scope.forgotDetails = function(){
      $state.go(states.signIn.forgot.name);
      $scope.$close(false);
    };
  }
);
