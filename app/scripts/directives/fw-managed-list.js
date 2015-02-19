angular.module('webApp').directive('fwManagedList', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      itemName: '@',
      items: '=',
      newItemState: '@',
      manageItemState: '@'
    },
    templateUrl: 'views/partials/managed-list.html'
  };
});
