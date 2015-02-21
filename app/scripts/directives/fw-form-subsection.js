angular.module('webApp').directive('fwFormSubsection', function () {
  'use strict';

  var summary;
  var summaryExpanded;
  var section;

  return {
    restrict: 'E',
    scope: true,
    templateUrl: function(element){
      summary = element.find('summary');
      summaryExpanded = element.find('summary-expanded');
      section = element.find('section');
      return 'views/partials/form-subsection.html';
    },
    compile: function(templateElement) {
      templateElement.find('summary-placeholder').replaceWith(summary.contents());
      templateElement.find('summary-expanded-placeholder').replaceWith(summaryExpanded.contents());
      templateElement.find('section-placeholder').replaceWith(section.contents());

      return {
        pre: function(scope, element, attrs) {
          scope.name = attrs.name;
        }
      };
    }
  };
});
