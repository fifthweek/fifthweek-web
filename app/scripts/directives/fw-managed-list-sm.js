angular.module('webApp').directive('fwManagedListSm', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      itemName: '@',
      items: '=',
      newItem: '&',
      manageItem: '&'
    },
    templateUrl: 'views/partials/managed-list-sm.html'
  };
});
