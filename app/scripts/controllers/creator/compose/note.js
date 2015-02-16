angular.module('webApp').controller(
  'newNoteCtrl', ['$scope',
  function($scope) {
    'use strict';

    var channels = [
      {
        name:'Share with everyone',
        value:'channel1' // Default channel
      },
      {
        name:'"Extras Channel" Only',
        value:'channel2'
      },
      {
        name:'"HD Channel" Only',
        value:'channel3'
      }
    ];

    // Simulate having no custom channels.
    channels = [ channels[0] ];

    if (channels.length > 1) {
      $scope.channels = channels;
      $scope.selectedChannel = channels[0];
    }

    $scope.newNoteData = {
      note: ''
    };
    $scope.postLaterSelected = false;
    $scope.isSubmitting = false;

    $scope.postNow = function() {
      $scope.isSubmitting = true;
    };

    $scope.postLater = function() {
      $scope.postLaterSelected = true;
    };

    $scope.cancelPostLater = function() {
      $scope.postLaterSelected = false;
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
