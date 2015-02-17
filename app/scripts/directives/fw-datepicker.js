angular.module('webApp').directive('fwDatepicker', function () {
  'use strict';

    return {
      scope: {
        ngDisabled: '='
      },
      templateUrl:'views/partials/datepicker.html'
    };

});
