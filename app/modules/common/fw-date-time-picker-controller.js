angular.module('webApp')
  .controller('fwDateTimePickerCtrl', function ($scope, fifthweekConstants) {
    'use strict';

    var selected = new Date();
    selected.setUTCHours(selected.getUTCHours() + 1, 0, 0, 0); // Default to the next hour.

    var ngModelCtrl;

    var render = function(){
      var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : undefined;

      if (date) {
        selected = date;
      }

      updateTemplate();
    };

    var updateTemplate = function(){
      var dateOnly = new Date(selected);
      dateOnly.setUTCHours(0, 0, 0, 0);

      $scope.date = dateOnly;
      $scope.time = new Date(selected);
    };

    var setViewValue = function(){
      if($scope.date && $scope.time){
        var result = new Date($scope.date);
        result.setUTCHours($scope.time.getUTCHours(), $scope.time.getUTCMinutes(), 0, 0);
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
