angular.module('webApp').factory('azureBlobStub',
  function($http, $q) {
    'use strict';
    var service = {};

    service.putBlockBlob = function(urlWithSasToken, blockId, requestData) {
      var uri = urlWithSasToken + '&comp=block&blockid=' + blockId;
      var config = {
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        },
        transformRequest: []
      };

      return $http.put(uri, requestData, config)
        .catch(function(response){
          return $q.reject(new AzureError('Failed to upload block blob.', response));
        });
    };

    service.commitBlockList = function(urlWithSasToken, blockIds, contentType) {
      var uri = urlWithSasToken + '&comp=blocklist';

      var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
      for (var i = 0; i < blockIds.length; i++) {
        requestBody += '<Latest>' + blockIds[i] + '</Latest>';
      }
      requestBody += '</BlockList>';
      var config = {
        headers: {
          'x-ms-blob-content-type': contentType
        }
      };

      return $http.put(uri, requestBody, config)
        .catch(function(response){
          return $q.reject(new AzureError('Failed to commit blob list.', response));
        });
    };

    service.tryGetAvailableBlobInformation = function(uri){
      return $http.head(uri)
        .then(function(response){
          var result = {
            uri: uri
          };
          var headers = response.headers();
          var width = headers['x-ms-meta-width'];
          var height = headers['x-ms-meta-height'];
          if(width && height){
            result.width = width;
            result.height = height;
          }
          return $q.when(result);
        })
        .catch(function(response){
          if(response.status === 404){
            return $q.when(undefined);
          }

          return $q.reject(new AzureError('Failed to check blob availability.', response));
        });
    };

    return service;
  });
