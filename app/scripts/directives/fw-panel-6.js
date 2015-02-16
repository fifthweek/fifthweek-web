angular.module('webApp').directive('fwPanel6', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    template:
    '<div class="row">' +
      '<div class="' +
        'col-ss-offset-1 col-ss-10 ' +
        'col-s-offset-0 col-s-8 ' +
        'col-sm-7 ' +
        'col-md-6">' +
        '<div class="panel panel-default">' +
          '<div class="panel-body jumbo-panel">' +
            '<ng-transclude></ng-transclude>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  };
});
