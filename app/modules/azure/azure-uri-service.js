angular.module('webApp').factory('azureUriService', function($q, $timeout, azureConstants, accessSignatures, azureBlobStub) {
    'use strict';

    var service = {};

    service.getAvailableImageUri = function(containerName, uri, thumbnail, cancellationToken) {
      if (thumbnail) {
        uri = uri + '/' + thumbnail;
      }

      return service.getAvailableFileUri(containerName, uri, cancellationToken);
    };

    service.getAvailableFileUri = function(containerName, uri, cancellationToken) {
      var pendingImageDataExpiry = _.now() + (azureConstants.timeoutMilliseconds);

      var waitForImage = function() {
        if (cancellationToken && cancellationToken.isCancelled) {
          return $q.reject(new CancellationError());
        }

        if(_.now() > pendingImageDataExpiry){
          return $q.reject(new DisplayableError('Timeout', 'Timed out waiting for image ' + uri + ' to be available.'));
        }

        return service.tryGetAvailableFileUri(containerName, uri).then(function(urlWithSignature) {
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

    service.tryGetAvailableFileUri = function(uri, containerName){
      return service.getFileUri(containerName, uri).then(function(uriWithSignature){
        return azureBlobStub.checkAvailability(uriWithSignature).then(function(exists) {
          return $q.when(exists ? uriWithSignature : undefined);
        });
      });
    };

    service.getImageUri = function(containerName, uri, thumbnail) {
      if (thumbnail) {
        uri = uri + '/' + thumbnail;
      }

      return service.getFileUri(containerName, uri);
    };

    service.getFileUri = function(containerName, uri){
      return accessSignatures.getContainerAccessInformation(containerName).then(function(data){
        return uri + data.signature;
      });
    };

    return service;
  }
);
