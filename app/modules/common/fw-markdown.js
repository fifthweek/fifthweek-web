'use strict';
angular.module('webApp').directive('fwMarkdown', function (markdownService) {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope:{
      replace: '@'
    },
    link: function ($scope, $elem, $attrs, ngModel) {
      if (!ngModel) {
        var html = markdownService.renderMarkdown($elem.text());
        if($scope.replace){
          $elem.replaceWith(html);
        }
        else{
          $elem.html(html);
        }
        return;
      }
      ngModel.$render = function () {
        var html = markdownService.renderMarkdown(ngModel.$viewValue || '');
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
