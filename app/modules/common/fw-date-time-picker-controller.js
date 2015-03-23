angular.module('webApp')
  .controller('fwDateTimePickerCtrl', function ($scope, fifthweekConstants) {
    'use strict';

    var selected = new Date();
    // Default to the next hour.
    selected.setUTCHours(selected.getUTCHours() + 1, 0, 0, 0);

    // This fudges the fact that the datepicker and timepicker controls deal with local time, when we want them
    // to be dealing with UTC. We add on the timezone offset to make the time look like it's UTC... in other words,
    // with this line we end up displaying the next UTC hour, but without it we would be displaying their next local hour
    // but then interpreting it as UTC, which would be strange.
    selected.setUTCMinutes(selected.getUTCMinutes() + selected.getTimezoneOffset());

    var ngModelCtrl;

    var render = function(){
      if (ngModelCtrl.$modelValue) {
        selected = new Date(ngModelCtrl.$modelValue);
      }

      updateTemplate();
    };

    var updateTemplate = function(){
      $scope.date = new Date(selected);
      $scope.time = new Date(selected);
    };

    var setViewValue = function(){
      if($scope.date && $scope.time){
        var result = new Date(Date.UTC($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), $scope.time.getHours(), $scope.time.getMinutes(), 0, 0));
        ngModelCtrl.$setViewValue( result );
        ngModelCtrl.$setValidity('dateTime', true);
      }
      else{
        ngModelCtrl.$setViewValue( undefined );
        ngModelCtrl.$setValidity('dateTime', false);
      }
    };

    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    $scope.format = fifthweekConstants.longDateFormat;

    $scope.openDatePicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    this.initialize = function(ngModelCtrl_){
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = render;

      $scope.$watchGroup(['date', 'time'], setViewValue);
    };
  });
