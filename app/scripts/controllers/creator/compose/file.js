angular.module('webApp').controller('composeFileCtrl',
  function($q, $scope, postsStub, composeUploadDelegate) {
    'use strict';

    $scope.uploadFormFile = 'file';

    var onUploadComplete = function(data) {
    };

    composeUploadDelegate.initialize($scope, onUploadComplete, postsStub.postFile);
  }
);
