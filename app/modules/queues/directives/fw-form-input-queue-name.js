angular.module('webApp').directive('fwFormInputQueueName', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/queues/directives/form-input-queue-name.html',
    link: function(scope, element, attrs) {
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
