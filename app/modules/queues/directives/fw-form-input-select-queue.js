angular.module('webApp').directive('fwFormInputSelectQueue', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      items:'=',
      selectedItem:'=',
      inputId:'@'
    },
    templateUrl:'modules/queues/directives/form-input-select-queue.html'
  };
});
