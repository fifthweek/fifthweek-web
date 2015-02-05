// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp').directive('buttonLoading',function () {
  'use strict';

  return {
    link:function (scope, element, attrs) {
      scope.$watch(
        function () {
          return scope.$eval(attrs.buttonLoading);
        },
        function (value) {
          if(value) {
            if (!attrs.hasOwnProperty('ngDisabled')) {
              element.addClass('disabled').attr('disabled', 'disabled');
            }

            element.data('resetText', element.html());
            element.html(element.data('loading-text'));
          } else {
            if (!attrs.hasOwnProperty('ngDisabled')) {
              element.removeClass('disabled').removeAttr('disabled');
            }

            element.html(element.data('resetText'));
          }
        }
      );
    }
  };
})
