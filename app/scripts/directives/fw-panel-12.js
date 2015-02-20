angular.module('webApp').directive('fwPanel12', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    template:
      '<div class="row">' +
        '<div class="col-s-12 col-sm-11 col-md-12">' +
          '<div class="panel panel-default">' +
            '<div class="panel-body jumbo-panel">' +
              '<ng-transclude></ng-transclude>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
  };
});
