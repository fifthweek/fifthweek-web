angular.module('webApp').controller('newImageCtrl',
  function($scope) {
    'use strict';

    var collections = [
      {
        name:'Blog',
        value:'collection1'
      },
      {
        name:'Wallpapers (HD Channel)',
        value:'collection2'
      },
      {
        name:'Side Comic (Extras Channel)',
        value:'collection3'
      }
    ];

    // Simulate first post (no collections created).
    collections = [];

    $scope.collections = collections;
    if (collections.length > 0) {
      $scope.selectedCollection = collections[0];
    }
    else {
      $scope.newCollectionName = '';
    }

    $scope.newImageData = {
      comment: ''
    };

    $scope.uploaded = false;
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

    $scope.onUploadComplete = function(fileId) {
      $scope.uploaded = true;
      $scope.fileId = fileId;
    };
  }
);
