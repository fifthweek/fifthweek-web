angular.module('webApp').directive('fwBlobImage',
  function (blobImageCtrlConstants) {
  'use strict';

  return {
    scope: {
      control: '=',
      thumbnail: '@',
      uri: '@',
      containerName: '@'
    },
    templateUrl:'views/partials/blob-image.html',
    link: function(scope/*, element, attrs*/){

      var updateHandler = function(uri, containerName, availableImmediately) {
        if(!uri) {
          scope.$broadcast(blobImageCtrlConstants.updateEvent);
          return;
        }

        if(scope.thumbnail){
          uri = uri + '/' + scope.thumbnail;
        }

        scope.$broadcast(blobImageCtrlConstants.updateEvent, uri,  containerName, availableImmediately);
      };

      if(scope.control){
        scope.control.initialize(updateHandler);
      }

      if(scope.uri && scope.containerName){
        updateHandler(scope.uri, scope.containerName, true);
      }
    }
  };
});
