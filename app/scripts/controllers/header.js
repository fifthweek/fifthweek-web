angular.module('webApp').controller(
  'HeaderCtrl',
  function($scope, navigationOrchestrator, navigationOrchestratorConstants) {
    'use strict';

    $scope.$on(
      navigationOrchestratorConstants.navigationChangedEvent,
      function(event, primaryNavigation, secondaryNavigation){
        $scope.navigation = secondaryNavigation;
      });

    $scope.navigation = navigationOrchestrator.getSecondaryNavigation();
  }
);
