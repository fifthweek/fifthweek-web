angular.module('webApp').directive('fwFileInputOnChange', function() {
  'use strict';

  return {
    restrict: 'A',
    scope : {
      fwFileInputOnChange: '&'
    },
    link: function (scope, element) {
      element.on('change', function (event) {
        scope.fwFileInputOnChange({ files: event.target.files });
        element.val('');
      });
    }
  };
});
