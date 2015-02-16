angular.module('webApp').directive('fwFormGroup', function (domUtilities) {
  'use strict';

  return {
    restrict: 'E',
    transclude: true,
    scope: true,
    templateUrl: 'views/partials/form-group.html',
    link: {
      pre: function(scope, element) {
        var input;
        var form;

        scope.getInputName = function() {
          if (!input) {
            input = element.find('input');
            if (input.length === 0) {
              input = element.find('textarea');
            }
          }

          return input.attr('name');
        };

        scope.getFormName = function() {
          return (form || (form = domUtilities.ancestor('FORM', element))).attr('name');
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
