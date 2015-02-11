angular.module('webApp').controller(
  'noteCtrl', ['$scope',
  function($scope, $analytics) {
    'use strict';

    $scope.postLater === false;

    $scope.sharePreference = [
      {
        name:'Share with everyone', 
        value:'shareWithAll'
      },
      {
        name:'Share with subscribers', 
        value:'shareWithSubscribers'
      }
    ];

    $scope.sharePreferenceInit = $scope.sharePreference[0];

    $scope.isSubmitting = false;

    $scope.postNow = function() {
      $scope.isSubmitting = true;
    };

    $scope.postToBacklog = function() {
      $scope.isSubmitting = true;
    };

  }
]);