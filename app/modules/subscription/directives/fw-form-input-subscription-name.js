angular.module('webApp').directive('fwFormInputSubscriptionName', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/subscription/directives/form-input-subscription-name.html',
    link: function(scope, element, attrs) {
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
