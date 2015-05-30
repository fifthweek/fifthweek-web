angular.module('webApp').directive('fwFileUpload', function () {
  'use strict';

    return {
      scope: {
        onUploadComplete: '&',
        description: '@',
        abbreviateProgress: '@',
        filePurpose: '@',
        channelId: '@?',
        accept: '@'
      },
      templateUrl:'views/partials/file-upload.html'
    };
});
