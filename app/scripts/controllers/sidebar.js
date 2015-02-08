angular.module('webApp').controller(
  'SidebarCtrl',
  function($scope, authenticationService, navigationOrchestrator, navigationOrchestratorConstants) {
    'use strict';

    $scope.currentUser = authenticationService.currentUser;

    $scope.$on(
      navigationOrchestratorConstants.navigationChangedEvent,
      function(event, primaryNavigation){
        $scope.navigation = primaryNavigation;
      });

    $scope.navigation = navigationOrchestrator.getPrimaryNavigation();
  }
);
