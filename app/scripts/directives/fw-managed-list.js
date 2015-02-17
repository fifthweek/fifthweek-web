angular.module('webApp').directive('fwManagedList', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      itemName: '@',
      items: '='
    },
    templateUrl: 'views/partials/managed-list.html'
  };
});
