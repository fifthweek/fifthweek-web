angular.module('webApp').directive('fwFormInputInvalidP', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    terminal: true, // http://stackoverflow.com/a/19228302/592768
    priority: 1000,
    link: function(scope, element, attrs) {
      var ruleName = attrs.fwFormInputInvalidP;
      element.removeAttr('fw-form-input-invalid-p'); // Remove self to avoid infinite compilation loop.
      element.attr('fw-form-input-invalid', ruleName);
      element.addClass('help-block');
      $compile(element)(scope);
    }
  };
});
