angular.module('webApp')
  .controller('datepickerCtrl', function ($scope, datepickerService) {
    'use strict';

    $scope.date = datepickerService.date;
    $scope.open = datepickerService.open;

  });
