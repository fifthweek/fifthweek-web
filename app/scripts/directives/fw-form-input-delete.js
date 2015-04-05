angular.module('webApp').directive('fwFormInputDelete', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      linkId: '@',
      itemType: '@',
      item: '=',
      dataEventTitle: '@',
      dataEventCategory: '@',
      delete: '&'
    },
    templateUrl: 'views/partials/form-input-delete.html'
  };
});
