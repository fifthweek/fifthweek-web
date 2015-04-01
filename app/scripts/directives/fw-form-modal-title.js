angular.module('webApp').directive('fwFormModalTitle', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-modal-title.html',
    link: function(scope, element, attrs) {
      scope.name = attrs.name;
    }
  };
});
