angular.module('webApp').directive('fwFileUpload', function () {
  'use strict';

    return {
      scope: {
        onUploadStarted: '&?',
        onUploadComplete: '&',
        description: '@',
        idPrefix: '@?',
        abbreviateProgress: '@',
        filePurpose: '@',
        channelId: '@?',
        accept: '@'
      },
      templateUrl:'views/partials/file-upload.html',
      link: {
        pre: function (scope) {
          if(!scope.idPrefix){
            scope.idPrefix = 'file';
          }
        }
      }
    };
});
