angular.module('webApp').directive('fwManagedList', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      itemName: '@',
      items: '=',
      newItemState: '@'
    },
    templateUrl: 'views/partials/managed-list.html'
  };
});
