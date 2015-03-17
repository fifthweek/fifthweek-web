angular.module('webApp').factory('azureUriService', function($q, $timeout, azureConstants, azureBlobAvailability) {
    'use strict';

    var service = {};

    service.getAvailableImageUrl = function(containerName, uri, thumbnail, cancellationToken) {
      if (thumbnail) {
        uri = uri + '/' + thumbnail;
      }

      return service.getAvailableFileUrl(containerName, uri, cancellationToken);
    };

    service.getAvailableFileUrl = function(containerName, uri, cancellationToken) {
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
              return $timeout(waitForImage, azureConstants.checkIntervalMilliseconds);
            }
          });
      };

      return waitForImage();
    };

    return service;
  }
);
