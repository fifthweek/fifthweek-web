angular.module('webApp').directive('fwAzureBackgroundImage', function (azureGetImageService, logService) {
  'use strict';

  return {
    scope: {
      thumbnail: '@',
      uri: '@',
      containerName: '@'
    },
    link: function(scope, element) {
      var cancellationToken;
      var onScopeValid = function() {
        cancellationToken = {};
        azureGetImageService.getImageUrl(scope.containerName, scope.uri, scope.thumbnail, cancellationToken)
          .then(function(imageUrl) {
            element.attr('style', 'background-image:url(\'' + imageUrl + '\')');
          })
          .catch(function(error){
            logService.error(error);
          });
      };

      scope.$watchGroup(['thumbnail', 'uri', 'containerName'], function() {
        if (scope.thumbnail && scope.uri && scope.containerName) {
          if (cancellationToken) {
            cancellationToken.isCancelled = true;
          }

          onScopeValid();
        }
      });
    }
  };
});
