angular.module('webApp').controller(
  'HeaderCtrl',
  function($scope, authenticationService, navigationOrchestrator, navigationOrchestratorConstants) {
    'use strict';

    $scope.currentUser = authenticationService.currentUser;

    $scope.$on(
      navigationOrchestratorConstants.navigationChangedEvent,
      function(event, primaryNavigation, secondaryNavigation){
        $scope.navigation = secondaryNavigation;
      });

    $scope.navigation = navigationOrchestrator.getSecondaryNavigation();
  }
);
