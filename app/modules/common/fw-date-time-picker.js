angular.module('webApp')

  // TODO: Remove this once ui-bootstrap 0.13.0 is released:
  // https://github.com/angular-ui/bootstrap/issues/2659
  .directive('datepickerPopup', ['datepickerPopupConfig', 'dateParser', 'dateFilter', function (datepickerPopupConfig, dateParser, dateFilter) {
    'use strict';
    return {
      'restrict': 'A',
      'require': '^ngModel',
      'link': function ($scope, element, attrs, ngModel) {
        var dateFormat = datepickerPopupConfig.datepickerPopup;

        //*** Temp fix for Angular 1.3 support [#2659](https://github.com/angular-ui/bootstrap/issues/2659)
        attrs.$observe('datepickerPopup', function(value) {
          dateFormat = value || datepickerPopupConfig.datepickerPopup;
          ngModel.$render();
        });

        ngModel.$formatters.push(function (value) {
          return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
        });
      }
    };
  }])

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
