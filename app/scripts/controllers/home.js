angular.module('webApp').controller(
  'HomeCtrl', [ '$rootScope',
    function ($rootScope) {
      'use strict';
      $rootScope.secondaryNav = true;

      //temp for dev
      $scope.homeSecondaryNav = true;

    }
  ]);