angular.module('webApp').directive('fwFormInputChannelPrice', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/channels/directives/form-input-channel-price.html',
    link: function(scope, element, attrs) {
      scope.showHelp = utilities.parseFlag(attrs, 'showHelp');
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
