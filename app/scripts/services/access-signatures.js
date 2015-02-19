angular.module('webApp')
  .constant('accessSignaturesConstants', {
    publicContainerName: 'public'
  })
  .factory('accessSignatures',
  function($q, accessSignaturesCache, accessSignaturesConstants) {
    'use strict';

    var service = {};

    service.getPublicAccessInformation = function(){
      return accessSignaturesCache.getSignatures()
        .then(function(data){
          return $q.when(data.publicSignature);
        });
    };

    service.getCreatorAccessInformation = function(creatorId){
      return accessSignaturesCache.getSignatures()
        .then(function(data){
          if (!creatorId){
            return $q.when(data.publicSignature);
          }
          else{
            var privateSignatures = data.privateSignatures;
            if (privateSignatures){
              for(var i = 0; i < privateSignatures.length; i++){
                if(privateSignatures[i].creatorId === creatorId){
                  return $q.when(privateSignatures[i].information);
                }
              }
            }

            return $q.reject(new FifthweekError('No shared access signatures found for creator: ' + creatorId));
          }
        });
    };

    service.getContainerAccessInformation = function(containerName){
      return accessSignaturesCache.getSignatures()
        .then(function(data){
          if (!containerName || containerName === accessSignaturesConstants.publicContainerName){
            return $q.when(data.publicSignature);
          }
          else{
            var privateSignatures = data.privateSignatures;
            if (privateSignatures){
              for(var i = 0; i < privateSignatures.length; i++){
                if(privateSignatures[i].information.containerName === containerName){
                  return $q.when(privateSignatures[i].information);
                }
              }
            }

            return $q.reject(new FifthweekError('No shared access signatures found for container: ' + containerName));
          }
        });
    };

    return service;
  });
