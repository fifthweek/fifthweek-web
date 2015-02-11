// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp').directive('fwFormGroupValidity', function () {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var inputName = attrs.fwFormGroupValidity;
      var input = scope.form[inputName];

      scope.$watch(
        function() {
          return input.$valid && input.$touched;
        },
        function(value) {
          if (value) {
            element.addClass('has-success');
          }
          else {
            element.removeClass('has-success');
          }
        }
      );

      scope.$watch(
        function() {
          return input.$invalid && ((input.$touched && input.$dirty) || scope.form.$submitted);
        },
        function(value) {
          if (value) {
            element.addClass('has-error');
          }
          else {
            element.removeClass('has-error');
          }
        }
      );
    }
  };
});
