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

    service.tryGetAvailableBlobInformation = function(containerName, blobName){
      return service.getBlobUri(containerName, blobName).then(function(uriWithSignature){
        return azureBlobStub.tryGetAvailableBlobInformation(uriWithSignature);
      });
    };

    service.getAvailableBlobInformation = function(containerName, blobName, cancellationToken) {
      var pendingImageDataExpiry = _.now() + (azureConstants.timeoutMilliseconds);

      var waitForImage = function() {
        if (cancellationToken && cancellationToken.isCancelled) {
          return $q.reject(new CancellationError());
        }

        if(_.now() > pendingImageDataExpiry){
          return $q.reject(new DisplayableError('Timeout', 'Timed out waiting for blob ' + blobName + ' in container ' + containerName + ' to be available.'));
        }

        return service.tryGetAvailableBlobInformation(containerName, blobName).then(function(urlWithSignature) {
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

    service.getAvailableImageInformation = function(containerName, fileId, thumbnail, cancellationToken) {
      var blobName = getBlobName(fileId, thumbnail);
      return service.getAvailableBlobInformation(containerName, blobName, cancellationToken);
    };

    service.getAvailableFileInformation = function(containerName, fileId, cancellationToken) {
      return service.getAvailableBlobInformation(containerName, fileId, cancellationToken);
    };

    service.tryGetAvailableFileInformation = function(containerName, fileId){
      return service.tryGetAvailableBlobInformation(containerName, fileId);
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
