angular.module('webApp').directive('fwFormInputUsername', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-input-username.html',
    link: function(scope, element, attrs) {
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
