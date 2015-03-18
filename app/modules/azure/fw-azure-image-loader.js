angular.module('webApp').directive('fwAzureImageLoader', function ($sce, azureUriService, logService) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      thumbnail: '@',
      fileId: '@',
      containerName: '@',
      outputUrl: '='
    },
    replace: true,
    link: function(scope) {
      var onScopeValid = function() {
        azureUriService.getImageUri(scope.containerName, scope.fileId, scope.thumbnail)
          .then(function(imageUrl) {
            scope.outputUrl = $sce.trustAsResourceUrl(imageUrl);
          })
          .catch(function(error){
            logService.error(error);
          });
      };

      scope.$watchGroup(['thumbnail', 'fileId', 'containerName'], function() {
        if (scope.thumbnail && scope.fileId && scope.containerName) {
          onScopeValid();
        }
      });
    }
  };
});
