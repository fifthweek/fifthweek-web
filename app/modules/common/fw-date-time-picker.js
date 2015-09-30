angular.module('webApp')

  .directive('fwDateTimePicker', function () {
  'use strict';

  return {
    restrict: 'E',
    require: ['fwDateTimePicker', 'ngModel'],
    controller:'fwDateTimePickerCtrl',
    scope: {},
    templateUrl: 'modules/common/fw-date-time-picker.html',
    link: function(scope, element, attrs, ctrls) {

      var dateTimePickerCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      dateTimePickerCtrl.initialize(ngModelCtrl);
    }
  };
});
