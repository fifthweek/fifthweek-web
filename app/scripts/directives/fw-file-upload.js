angular.module('webApp').directive('fwFileUpload', function () {
  'use strict';

    return {
      scope: {
        onUploadComplete: '&',
        fileType: '@'
      },
      templateUrl:'views/partials/file-upload.html'
    };

});
