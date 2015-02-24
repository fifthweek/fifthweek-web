angular.module('webApp').controller('backlogEditPostCtrl',
  function($scope, postId) {
    'use strict';

    $scope.model = {
      isNote: false,
      isImage: false,
      isFile: false,
      note: 'Hang in there folks, nearly ready!'
    };

    if (postId === 'a') {
      $scope.model.isNote = true;
    }
    else if (postId === 'b') {
      $scope.model.isImage = true;
    }
    else {
      $scope.model.isFile = true;
    }
  }
);
