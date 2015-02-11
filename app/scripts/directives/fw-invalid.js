angular.module('webApp').directive('fwInvalid', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element, attrs) {

      var closest = function(name, element) {
        var parent = element.parent();
        var result = parent.find('input');
        if (result.length === 0) {
          return closest(name, parent);
        }

        return result;
      };

      var ngIf;
      var inputName = closest('input', element).attr('name');
      var ruleName = attrs.fwInvalid;

      if (ruleName) {
        ngIf = 'form.' + inputName + '.$error.' + ruleName + ' && ((form.' + inputName + '.$touched && form.' + inputName + '.$dirty) || form.$submitted)';
      }
      else {
        ngIf = 'form.' + inputName + '.$invalid && ((form.' + inputName + '.$touched && form.' + inputName + '.$dirty) || form.$submitted)';
      }

      element.removeAttr('fw-invalid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
