angular.module('webApp').factory('azureGetImageService', function($q, $timeout, azureConstants, azureBlobAvailability) {
    'use strict';

    var service = {};

    service.getImageUrl = function(containerName, uri, thumbnail, cancellationToken) {
      if (thumbnail) {
        uri = uri + '/' + thumbnail;
      }

      var pendingImageDataExpiry = _.now() + (azureConstants.timeoutMilliseconds);

      var waitForImage = function() {
        if (cancellationToken && cancellationToken.isCancelled) {
          return $q.reject(new CancellationError());
        }

        if(_.now() > pendingImageDataExpiry){
          return $q.reject(new DisplayableError('Timeout', 'Timed out waiting for image ' + uri + ' to be available.'));
        }

        return azureBlobAvailability.tryGetAvailableFileUrl(uri, containerName)
          .then(function (urlWithSignature) {
            if (urlWithSignature) {
              return urlWithSignature;
            }
            else {
              return pauseAndWaitForImage(azureConstants.checkIntervalMilliseconds);
            }
          });
      };

      var pauseAndWaitForImage = function(intervalMilliseconds){
        return $timeout(waitForImage, intervalMilliseconds);
      };

      return waitForImage();
    };

    return service;
  }
);
