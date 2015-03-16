angular.module('webApp').directive('fwImage', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      src: '@'
    },
    replace: true,
    templateUrl: 'modules/common/fw-image.html'
  };
});
