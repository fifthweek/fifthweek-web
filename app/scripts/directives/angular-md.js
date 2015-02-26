'use strict';
angular.module('yaru22.md', []).directive('md', function () {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function ($scope, $elem, $attrs, ngModel) {
      if (!ngModel) {
        var html = marked($elem.text());
        $elem.replaceWith(html);
        return;
      }
      ngModel.$render = function () {
        var html = marked(ngModel.$viewValue || '');
        $elem.replaceWith(html);
      };
    }
  };
});
