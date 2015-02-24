angular.module('webApp').directive('fwFormModal', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: function(element){
      element.data('form-body', element.find('form-body'));
      element.data('form-buttons', element.find('form-buttons'));
      return 'views/partials/form-modal.html';
    },
    compile: function(templateElement) {
      templateElement.find('form-body-placeholder').replaceWith(templateElement.data('form-body').contents());
      templateElement.find('form-buttons-placeholder').replaceWith(templateElement.data('form-buttons').contents());

      return {
        pre: function(scope, element, attrs) {
          scope.name = attrs.name;
        }
      };
    }
  };
});
