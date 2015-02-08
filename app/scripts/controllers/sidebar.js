angular.module('webApp').controller(
  'SidebarCtrl',
  function($scope, navigationOrchestrator, navigationOrchestratorConstants) {
    'use strict';

    $scope.$on(
      navigationOrchestratorConstants.navigationChangedEvent,
      function(event, primaryNavigation){
        $scope.navigation = primaryNavigation;
      });

    $scope.navigation = navigationOrchestrator.getPrimaryNavigation();
  }
);
