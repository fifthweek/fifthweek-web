angular.module('webApp').directive('fwComposeOptions', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'modules/creator-compose/directives/compose-options.html',
    controller: 'composeOptionsCtrl'
  };
});
