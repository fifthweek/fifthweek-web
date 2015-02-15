angular.module('webApp')
  .controller('fileUploadCtrl', function ($scope) {
    'use strict';

    $scope.upload = function() {
      var handler = $scope.onUploadComplete;
      if (_.isFunction(handler)) {
        handler({fileId: 'SomeFileId'});
      }
    };
  });
