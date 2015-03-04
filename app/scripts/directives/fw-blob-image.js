angular.module('webApp').directive('fwBlobImage',
  function (blobImageCtrlConstants) {
  'use strict';

  return {
    scope: {
      control: '=',
      thumbnail: '@',
      fileUri: '@',
      containerName: '@'
    },
    templateUrl:'views/partials/blob-image.html',
    link: function(scope/*, element, attrs*/){

      var updateHandler = function(fileUri, containerName, availableImmediately) {
        if(!fileUri) {
          scope.$broadcast(blobImageCtrlConstants.updateEvent);
          return;
        }

        if(scope.thumbnail){
          fileUri = fileUri + '/' + scope.thumbnail;
        }

        scope.$broadcast(blobImageCtrlConstants.updateEvent, fileUri,  containerName, availableImmediately);
      };

      if(scope.control){
        scope.control.initialize(updateHandler);
      }

      if(scope.fileUri && scope.containerName){
        updateHandler(scope.fileUri, scope.containerName, true);
      }
    }
  };
});
