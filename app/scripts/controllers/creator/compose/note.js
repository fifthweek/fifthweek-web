angular.module('webApp').controller(
  'newNoteCtrl', ['$scope',
  function($scope) {
    'use strict';

    $scope.model = {
      postLater: false,
      input: {
        note: ''
      }
    };

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
    // channels = [ channels[0] ];

    if (channels.length > 1) {
      $scope.model.channels = channels;
      $scope.model.input.selectedChannel = channels[0];
    }

    $scope.postNow = function() { };

    $scope.postToBacklog = function() { };

    $scope.postLater = function() {
      $scope.model.postLater = true;
    };

    $scope.cancelPostLater = function() {
      $scope.model.postLater = false;
    };

    //toggle checkboxes 'checked' state
    $scope.uncheck = function (event) {
      if ($scope.checked == event.target.value) $scope.checked = false
    };
  }
]);
