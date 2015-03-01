angular.module('webApp').directive('fwFormGroup', function () {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    replace:true,
    scope: true,
    require: '^form',
    templateUrl: 'views/partials/form-group.html',
    link: {
      pre: function(scope, element, attrs, formCtrl) {

        // Allow optimisation through explicit specification of which elements to use.
        var inputName = element.inputName;
        var formName = formCtrl.$name;

        scope.getInputName = function() {
          if (!inputName) {
            var input = element.find('input');
            if (input.length === 0) {
              input = element.find('textarea');
            }

            inputName = input.attr('name');
          }

          return inputName;
        };

        scope.getFormName = function() {
          return formName;
        };
      },
      post: function(scope) {
        // Set bindings for directive's own use
        var formName = scope.getFormName();
        var inputName = scope.getInputName();

        if (formName === undefined) {
          throw new FifthweekError('Outer form must exist with name attribute defined');
        }

        if (inputName === undefined) {
          throw new FifthweekError('Inner input must exist with name attribute defined');
        }

        scope.input = scope[formName][inputName];
        scope.form = scope[formName];
      }
    }
  };
});
