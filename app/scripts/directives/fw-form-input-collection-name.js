angular.module('webApp').directive('fwFormInputCollectionName', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-input-collection-name.html',
    link: function(scope, element, attrs) {
      scope.showHelp = utilities.parseFlag(attrs, 'showHelp');
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
