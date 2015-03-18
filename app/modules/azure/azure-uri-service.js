angular.module('webApp').factory('azureUriService', function($q, $timeout, azureConstants, accessSignatures, azureBlobStub) {
    'use strict';

    var service = {};

    var getBlobName = function (fileId, thumbnail) {
      if (thumbnail) {
        return fileId + '/' + thumbnail;
      }

      return fileId;
    };

    service.getBlobUri = function(containerName, blobName){
      return accessSignatures.getContainerAccessInformation(containerName).then(function(data){
        return data.uri + '/' + blobName + data.signature;
      });
    };

    service.tryGetAvailableBlobUri = function(containerName, blobName){
      return service.getBlobUri(containerName, blobName).then(function(uriWithSignature){
        return azureBlobStub.checkAvailability(uriWithSignature).then(function(exists) {
          return $q.when(exists ? uriWithSignature : undefined);
        });
      });
    };

    service.getAvailableBlobUri = function(containerName, blobName, cancellationToken) {
      var pendingImageDataExpiry = _.now() + (azureConstants.timeoutMilliseconds);

      var waitForImage = function() {
        if (cancellationToken && cancellationToken.isCancelled) {
          return $q.reject(new CancellationError());
        }

        if(_.now() > pendingImageDataExpiry){
          return $q.reject(new DisplayableError('Timeout', 'Timed out waiting for blob ' + blobName + ' in container ' + containerName + ' to be available.'));
        }

        return service.tryGetAvailableBlobUri(containerName, blobName).then(function(urlWithSignature) {
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

    service.getAvailableImageUri = function(containerName, fileId, thumbnail, cancellationToken) {
      var blobName = getBlobName(fileId, thumbnail);
      return service.getAvailableBlobUri(containerName, blobName, cancellationToken);
    };

    service.getAvailableFileUri = function(containerName, fileId, cancellationToken) {
      return service.getAvailableBlobUri(containerName, fileId, cancellationToken);
    };

    service.tryGetAvailableFileUri = function(containerName, fileId){
      return service.tryGetAvailableBlobUri(containerName, fileId);
    };

    service.getImageUri = function(containerName, fileId, thumbnail) {
      var blobName = getBlobName(fileId, thumbnail);
      return service.getBlobUri(containerName, blobName);
    };

    service.getFileUri = function(containerName, fileId){
      return service.getBlobUri(containerName, fileId);
    };

    return service;
  }
);
