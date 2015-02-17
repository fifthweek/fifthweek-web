angular.module('webApp').directive('fwOnChange', function() {
  'use strict';

  return {
    restrict: 'A',
    scope : {
      fwOnChange: '&'
    },
    link: function (scope, element) {
      element.on('change', function (event) {
        scope.fwOnChange(event.target.files);
        element.val('');
      });
    }
  };
});
