angular.module('webApp').directive('fwValid', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element) {

      var closest = function(name, element) {
        var parent = element.parent();
        var result = parent.find('input');
        if (result.length === 0) {
          return closest(name, parent);
        }

        return result;
      };

      var inputName = closest('input', element).attr('name');
      var ngIf = 'form.' + inputName + '.$valid && form.' + inputName + '.$touched';

      element.removeAttr('fw-valid'); // Remove self to avoid infinite compilation loop.
      element.attr('ng-if', ngIf);
      $compile(element)(scope);
    }
  };
});
