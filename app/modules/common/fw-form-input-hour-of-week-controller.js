angular.module('webApp').controller('fwFormInputHourOfWeekCtrl', function ($q, $scope, releaseTimeFormatter) {
  'use strict';

  var ngModelCtrl;

  var modulo = function(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
  };

  var setViewValue = function(){
    if($scope.model.day && $scope.model.hour){
      ngModelCtrl.$setViewValue($scope.model.day.value + $scope.model.hour.value);
      ngModelCtrl.$setValidity('hourOfWeek', true);
    }
    else{
      ngModelCtrl.$setViewValue( undefined );
      ngModelCtrl.$setValidity('hourOfWeek', false);
    }
  };

  var render = function(){
    var day = 0;
    var hour = 0;
    if (ngModelCtrl.$modelValue) {
      hour = ngModelCtrl.$modelValue % 24;

      var offsetFromSunday = Math.floor(ngModelCtrl.$modelValue / 24);
      var offsetFromMonday = modulo(offsetFromSunday - 1, 7);
      day = offsetFromMonday;
    }

    $scope.model.day = $scope.model.days[day];
    $scope.model.hour = $scope.model.hours[hour];
  };

  $scope.model = {
    days: [
      {
        name: 'Monday',
        value: 24
      },
      {
        name: 'Tuesday',
        value: 48
      },
      {
        name: 'Wednesday',
        value: 72
      },
      {
        name: 'Thursday',
        value: 96
      },
      {
        name: 'Friday',
        value: 120
      },
      {
        name: 'Saturday',
        value: 144
      },
      {
        name: 'Sunday',
        value: 0
      }
    ],
    hours: _.map(_.range(24), function(hour) {
      return {
        name: releaseTimeFormatter.getTimeOfWeek(hour),
        value: hour
      };
    })
  };

  this.initialize = function(ngModelCtrl_){
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = render;

    $scope.$watchGroup(['model.day', 'model.hour'], setViewValue);
  };
});
