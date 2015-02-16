angular.module('webApp').controller(
  'newNoteCtrl', ['$scope',
  function($scope) {
    'use strict';

    $scope.postLater = false;

    $scope.sharePreference = [
      {
        name:'Share with everyone',
        value:''
      },
      {
        name:'"Extras Channel" Only',
        value:'channel1'
      },
      {
        name:'"HD Channel" Only',
        value:'channel2'
      }
    ];

    $scope.sharePreferenceInit = $scope.sharePreference[0];

    $scope.isSubmitting = false;

    $scope.postNow = function() {
      $scope.isSubmitting = true;
    };

    //disable specific date checkbox
    $scope.postSpecificDate = false;

    //toggle checkboxes 'checked' state
    $scope.uncheck = function (event) {
      if ($scope.checked == event.target.value) $scope.checked = false
    };

    $scope.postToBacklog = function() {
      $scope.isSubmitting = true;
    };

  }
]);
