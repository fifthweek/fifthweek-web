angular.module('webApp').directive('fwFormInputValid', function ($compile, domUtilities) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element) {

      var inputName = domUtilities.closest('input', element, 2).attr('name');
      var ngIf = 'form.' + inputName + '.$valid && form.' + inputName + '.$touched';

      element.removeAttr('fw-form-input-valid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
