angular.module('webApp').directive('fwFormInputHourOfWeek', function () {
  'use strict';

  return {
    restrict: 'E',
    require: ['fwFormInputHourOfWeek', 'ngModel'],
    controller:'fwFormInputHourOfWeekCtrl',
    scope: {},
    templateUrl: 'modules/common/fw-form-input-hour-of-week.html',
    link: function(scope, element, attrs, ctrls) {

      var hourOfWeekCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      hourOfWeekCtrl.initialize(ngModelCtrl);
    }
  };
});
