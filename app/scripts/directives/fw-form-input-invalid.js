angular.module('webApp').directive('fwFormInputInvalid', function ($compile, domUtilities) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element, attrs) {

      var ngIf;
      var inputName = domUtilities.closest('input', element, 2).attr('name');
      var ruleName = attrs.fwFormInputInvalid;

      if (ruleName) {
        ngIf = 'form.' + inputName + '.$error.' + ruleName + ' && ((form.' + inputName + '.$touched && form.' + inputName + '.$dirty) || form.$submitted)';
      }
      else {
        ngIf = 'form.' + inputName + '.$invalid && ((form.' + inputName + '.$touched && form.' + inputName + '.$dirty) || form.$submitted)';
      }

      element.removeAttr('fw-form-input-invalid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
