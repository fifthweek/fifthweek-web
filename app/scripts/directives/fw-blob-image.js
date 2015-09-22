angular.module('webApp').directive('fwBlobImage',
  function (blobImageCtrlConstants) {
  'use strict';

  return {
    scope: {
      control: '=',
      thumbnail: '@',
      fileId: '@',
      containerName: '@'
    },
    templateUrl:'views/partials/blob-image.html',
    link: function(scope/*, element, attrs*/){

      var updateHandler = function(containerName, fileId, availableImmediately, completeCallback) {
        if(!fileId) {
          scope.$broadcast(blobImageCtrlConstants.updateEvent);
          return;
        }

        scope.$broadcast(blobImageCtrlConstants.updateEvent, containerName, fileId, scope.thumbnail, availableImmediately, completeCallback);
      };

      if(scope.control){
        scope.control.initialize(updateHandler);
      }

      if(scope.fileId && scope.containerName){
        updateHandler(scope.containerName, scope.fileId, true);
      }
    }
  };
});
