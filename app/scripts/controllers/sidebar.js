angular.module('webApp').controller(
  'SidebarCtrl',
  function($scope, $state, navigationOrchestrator, navigationOrchestratorConstants) {
    'use strict';

    $scope.$on(
      navigationOrchestratorConstants.navigationChangedEvent,
      function(event, primaryNavigation){
        $scope.navigation = primaryNavigation;
      });

    $scope.navigation = navigationOrchestrator.getPrimaryNavigation();

    $scope.navigate = function(state, action){
      if(action){
        return action();
      }

      $state.go(state);
    };
  }
);
