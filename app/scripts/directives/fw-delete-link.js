angular.module('webApp').directive('fwDeleteLink', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      class: '@',
      linkId: '@',
      itemType: '@',
      item: '=',
      eventTitle: '@',
      eventCategory: '@',
      delete: '&'
    },
    templateUrl: 'views/partials/delete-link.html'
  };
});
