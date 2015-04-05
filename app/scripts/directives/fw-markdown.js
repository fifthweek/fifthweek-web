'use strict';
angular.module('webApp').directive('fwMarkdown', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope:{
      replace: '@'
    },
    link: function ($scope, $elem, $attrs, ngModel) {
      if (!ngModel) {
        var html = marked($elem.text());
        if($scope.replace){
          $elem.replaceWith(html);
        }
        else{
          $elem.html(html);
        }
        return;
      }
      ngModel.$render = function () {
        var html = marked(ngModel.$viewValue || '');
        if($scope.replace){
          $elem.replaceWith(html);
        }
        else{
          $elem.html(html);
        }
      };
    }
  };
});
