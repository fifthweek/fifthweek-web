angular.module('webApp').directive('fwFormInputSelect', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      items:'=',
      selectedItem:'=',
      ngDisabled:'@',
      inputId:'@'
    },
    templateUrl:'views/partials/form-input-select.html'
  };
});
