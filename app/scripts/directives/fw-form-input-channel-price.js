angular.module('webApp').directive('fwFormInputChannelPrice', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-input-channel-price.html',
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
