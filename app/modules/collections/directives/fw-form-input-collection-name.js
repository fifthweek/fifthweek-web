angular.module('webApp').directive('fwFormInputCollectionName', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/collections/directives/form-input-collection-name.html',
    link: function(scope, element, attrs) {
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
