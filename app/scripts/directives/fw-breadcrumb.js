angular.module('webApp').directive('fwBreadcrumb', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      itemSource: '&items'
    },
    templateUrl: 'views/partials/breadcrumb.html',
    link:function (scope) {
      scope.items = scope.itemSource();
    }
  };
});
