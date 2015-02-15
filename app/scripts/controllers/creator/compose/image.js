angular.module('webApp').controller('newImageCtrl',
  function($scope) {
    'use strict';

    $scope.uploaded = false;
    $scope.postLaterSelected = false;

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

    $scope.postLater = function() {
      $scope.postLaterSelected = true;
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

    $scope.onUploadComplete = function(fileId) {
      $scope.uploaded = true;
      $scope.fileId = fileId;
    };
  }
);
