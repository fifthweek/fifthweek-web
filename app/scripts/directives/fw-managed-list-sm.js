angular.module('webApp').directive('fwManagedListSm', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      itemName: '@',
      items: '=',
      newItem: '&',
      manageItem: '&'
    },
    templateUrl: 'views/partials/managed-list-sm.html'
  };
});
