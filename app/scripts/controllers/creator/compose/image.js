angular.module('webApp').controller('newImageCtrl',
  function($scope) {
    'use strict';

    $scope.model = {
      uploaded: false,
      postToQueue: true,
      postLater: false,
      input: {
        comment: '',
        fileId: ''
      }
    };

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

    $scope.model.collections = collections;
    if (collections.length > 0) {
      $scope.model.input.selectedCollection = collections[0];
    }
    else {
      $scope.model.input.newCollectionName = '';
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

    $scope.onUploadComplete = function(data) {
      $scope.model.uploaded = true;
      $scope.model.input.fileId = data.fileId;
    };
  }
);
