angular.module('webApp').directive('fwFormInputHourOfWeek', function () {
  'use strict';

  return {
    restrict: 'E',
    require: ['fwFormInputHourOfWeek', 'ngModel'],
    controller:'formInputHourOfWeekCtrl',
    scope: {},
    templateUrl: 'views/partials/form-input-hour-of-week.html',
    link: function(scope, element, attrs, ctrls) {

      var hourOfWeekCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      hourOfWeekCtrl.initialize(ngModelCtrl);
    }
  };
});
