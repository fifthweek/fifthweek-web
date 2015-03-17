angular.module('webApp')
  .factory('azureBlobAvailability', function($q, azureBlobStub, accessSignatures) {
    'use strict';

    var service = {};

    service.tryGetAvailableFileUrl = function(uri, containerName){
      return accessSignatures.getContainerAccessInformation(containerName)
        .then(function(data){
          var uriWithSignature = uri + data.signature;
          return azureBlobStub.checkAvailability(uriWithSignature)
            .then(function(exists) {
              return $q.when(exists ? uriWithSignature : undefined);
            });
        });
    };

    return service;
  });
