angular.module('webApp').directive('fwRuleInvalid', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element, attrs) {
      var ruleName = attrs.fwRuleInvalid;
      var inputName = element.parent().parent().find('input').attr('name');
      var ngIf = 'form.' + inputName + '.$error.' + ruleName + ' && ((form.' + inputName + '.$touched && form.' + inputName + '.$dirty) || form.$submitted)';
      element.removeAttr('fw-rule-invalid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
