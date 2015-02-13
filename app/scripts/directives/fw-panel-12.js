angular.module('webApp').directive('fwPanel12', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: { title:'@' },
    template:
    '<div class="row">' +
      '<div class="col-xs-12">' +
        '<div class="panel panel-default">' +
          '<div class="panel-body jumbo-panel">' +
            '<ng-transclude></ng-transclude>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  };
});
