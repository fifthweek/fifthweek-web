angular.module('webApp').directive('fwCol50', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: { title:'@' },
    template:
    '<div class="row">' +
      '<div class="' +
        'col-ss-offset-1 col-ss-10 ' +
        'col-s-offset-0 col-s-8 ' +
        'col-sm-7 ' +
        'col-md-6">' +
          '<ng-transclude></ng-transclude>' +
      '</div>' +
    '</div>'
  };
});
