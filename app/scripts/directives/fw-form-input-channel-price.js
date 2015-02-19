angular.module('webApp').directive('fwFormInputChannelPrice', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'views/partials/form-input-channel-price.html',
    link: function(scope, element, attrs) {
      scope.hideHelp = utilities.parseFlag(attrs, 'hideHelp');
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
