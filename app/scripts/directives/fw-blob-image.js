angular.module('webApp').directive('fwBlobImage',
  function (blobImageCtrlConstants) {
  'use strict';

  return {
    scope: {
      control: '=',
      width: '@',
      height: '@',
      pendingWidth: '@',
      pendingHeight: '@',
      borderRadius: '@',
      thumbnail: '@'
    },
    templateUrl:'views/partials/blob-image.html',
    link: function(scope/*, element, attrs*/){
      scope.internalControl = scope.control || {};
      scope.internalControl.update = function(fileUri, containerName, availableImmediately) {

        if(!fileUri) {
          scope.$broadcast(blobImageCtrlConstants.updateEvent);
          return;
        }

        if(scope.thumbnail){
          fileUri = fileUri + '/' + scope.thumbnail;
        }

        scope.$broadcast(blobImageCtrlConstants.updateEvent, fileUri,  containerName, availableImmediately);
      };
    }
  };
});
