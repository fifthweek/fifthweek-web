angular.module('webApp').directive('fwFormInputSelectQueue', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      items:'=',
      selectedItem:'=',
      id:'@'
    },
    templateUrl:'modules/queues/directives/form-input-select-queue.html'
  };
});
