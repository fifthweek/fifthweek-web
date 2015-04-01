angular.module('webApp').directive('fwFormCancelButton',
  function ($state) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: 'modules/common/fw-form-cancel-button.html',
    link: function(scope) {
      scope.cancelForm = function(){
        $state.reload();
      };
    }
  };
});
