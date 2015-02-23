angular.module('webApp').directive('fwBlobImage',
  function (blobImageCtrlConstants) {
  'use strict';

  return {
    scope: {
      control: '=',
      width: '@',
      height: '@',
      borderRadius: '@',
      thumbnail: '@'
    },
    templateUrl:'views/partials/blob-image.html',
    link: function(scope/*, element, attrs*/){
      scope.internalControl = scope.control || {};
      scope.internalControl.update = function(fileUri, containerName) {

        if(scope.thumbnail){
          fileUri = fileUri + '/' + scope.thumbnail;
        }

        scope.$broadcast(blobImageCtrlConstants.updateEvent, fileUri,  containerName);
      };
    }
  };
});
