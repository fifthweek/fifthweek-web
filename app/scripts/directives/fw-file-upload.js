angular.module('webApp').directive('fwFileUpload', function () {
  'use strict';

    return {
      scope: {
        onUploadComplete: '&',
        description: '@',
        filePurpose: '@',
        accept: '@'
      },
      templateUrl:'views/partials/file-upload.html'
    };

});
