angular.module('webApp').directive('fwFormInputValid', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element) {
      var formGroup = scope.$parent;
      var formName = formGroup.getFormName();
      var inputName = formGroup.getInputName();
      inputName = formName + '.' + inputName;

      var ngIf = inputName + '.$valid && ' + inputName + '.$touched';

      element.removeAttr('fw-form-input-valid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
