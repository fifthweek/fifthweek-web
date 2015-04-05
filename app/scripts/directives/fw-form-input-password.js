angular.module('webApp').directive('fwFormInputPassword', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-input-password.html',
    link: function(scope, element, attrs) {
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
