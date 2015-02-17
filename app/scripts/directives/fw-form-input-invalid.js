angular.module('webApp').directive('fwFormInputInvalid', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element, attrs) {
      var formName = scope.getFormName();
      var inputName = scope.getInputName();
      var ruleName = attrs.fwFormInputInvalid;
      inputName = formName + '.' + inputName;

      var ngIf;
      if (ruleName) {
        ngIf = inputName + '.$error.' + ruleName + ' && ((' + inputName + '.$touched && ' + inputName + '.$dirty) || ' + formName + '.$submitted)';
      }
      else {
        ngIf = inputName + '.$invalid && ((' + inputName + '.$touched && ' + inputName + '.$dirty) || ' + formName + '.$submitted)';
      }

      element.removeAttr('fw-form-input-invalid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
