angular.module('webApp').directive('fwFormGroupValidity', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var inputName = attrs.fwFormGroupValidity;
      var ngClass = '{' +
        '\'has-error\' : form.' + inputName + '.$invalid && ((form.' + inputName + '.$touched && form.' + inputName + '.$dirty) || form.$submitted),' +
        '\'has-success\' : form.' + inputName + '.$valid && form.' + inputName + '.$touched}';
      element.removeAttr('fw-form-group-validity'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-class', ngClass);
      $compile(element)(scope);
    }
  };
});
