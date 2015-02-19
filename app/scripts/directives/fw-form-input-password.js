angular.module('webApp').directive('fwFormInputPassword', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-input-password.html',
    link: function(scope, element, attrs) {
      scope.required = attrs.hasOwnProperty('required') ? attrs.required : 'false';
      scope.focus = attrs.hasOwnProperty('focus') ? attrs.focus : 'false';
      scope.placeholder = attrs.placeholder;
      scope.breakpoint = attrs.breakpoint || 'sm';
      scope.inputId = attrs.ngModel.replace('.', '-');
      utilities.forScope(scope).defineModelAccessor(attrs);
    }
  };
});
