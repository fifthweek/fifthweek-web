angular.module('webApp').directive('fwFormSubsection', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    replace: true,
    templateUrl: function(element){
      element.data('summary', element.find('summary'));
      element.data('summary-expanded', element.find('summary-expanded'));
      element.data('section', element.find('section'));
      return 'views/partials/form-subsection.html';
    },
    compile: function(templateElement) {
      templateElement.find('summary-placeholder').replaceWith(templateElement.data('summary').contents());
      templateElement.find('summary-expanded-placeholder').replaceWith(templateElement.data('summary-expanded').contents());
      templateElement.find('section-placeholder').replaceWith(templateElement.data('section').contents());

      return {
        pre: function(scope, element, attrs) {
          scope.name = attrs.name;
        }
      };
    }
  };
});
