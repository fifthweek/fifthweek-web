angular.module('webApp').directive('fwFormInputDateTimePicker', function (utilities) {
  'use strict';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/common/fw-form-input-date-time-picker.html',
    link: function(scope, element, attrs) {
      utilities.forDirective(scope, element, attrs).scaffoldFormInput();
    }
  };
});
