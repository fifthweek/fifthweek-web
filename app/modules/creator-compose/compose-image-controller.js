angular.module('webApp').controller('composeImageCtrl',
  function($q, $scope, postsStub, blobImageControlFactory, composeUploadDelegate) {
    'use strict';

    $scope.uploadFormFile = 'image';

    $scope.blobImage = blobImageControlFactory.createControl();

    var onUploadComplete = function(data) {
      $scope.blobImage.update(data.uri, data.containerName);
    };

    composeUploadDelegate.initialize($scope, onUploadComplete, postsStub.postImage);
  }
);
