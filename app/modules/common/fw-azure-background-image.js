angular.module('webApp').directive('fwAzureBackgroundImage', function ($q, $timeout, blobImageCtrlConstants, azureBlobAvailability, logService) {
  'use strict';

  return {
    scope: {
      thumbnail: '@',
      uri: '@',
      containerName: '@'
    },
    link: function(scope, element) {
      var onScopeValid = function() {
        var pendingImageDataExpiry = _.now() + (blobImageCtrlConstants.timeoutMilliseconds);

        var waitForImage = function() {
          if(_.now() > pendingImageDataExpiry){
            return $q.reject(new DisplayableError('Timeout', 'Timed out waiting for image ' + scope.uri + ' to be available.'));
          }

          return azureBlobAvailability.checkAvailability(scope.uri, scope.containerName)
            .then(function (urlWithSignature) {
              if (urlWithSignature) {
                return assignImage(urlWithSignature);
              }
              else {
                return pauseAndWaitForImage(blobImageCtrlConstants.checkIntervalMilliseconds);
              }
            });
        };

        var pauseAndWaitForImage = function(intervalMilliseconds){
          return $timeout(waitForImage, intervalMilliseconds);
        };

        var assignImage = function(urlWithSignature){
          element.attr('style', 'background-image:url(\'' + urlWithSignature + '\')');
          return $q.when();
        };

        waitForImage().catch(function(error){
          logService.error(error);
        });
      };

      scope.$watchGroup(['thumbnail', 'uri', 'containerName'], function() {
        if (scope.thumbnail && scope.uri && scope.containerName) {
          onScopeValid();
        }
      });
    }
  };
});
