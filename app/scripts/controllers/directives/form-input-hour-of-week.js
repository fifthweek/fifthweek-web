angular.module('webApp').controller('formInputHourOfWeekCtrl', function ($q, $scope) {
  'use strict';

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
    ]
  };

  $scope.model.day = $scope.model.days[0];

  $scope.itemTypeCapitalized = _.capitalize($scope.itemType)

  $scope.timeChanged = function() {
  };
});
