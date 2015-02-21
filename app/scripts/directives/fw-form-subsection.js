angular.module('webApp').directive('fwFormSubsection', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      name: '@'
    },
    templateUrl: 'views/partials/form-subsection.html'
  };
});
