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

    service.getContainerAccessMap = function(){
      return accessSignaturesCache.getSignatures()
        .then(function(data){

          var containerNameResult = {};
          containerNameResult[data.publicSignature.containerName] = data.publicSignature;

          containerNameResult = _.reduce(data.privateSignatures, function(signatures, item){
            signatures[item.information.containerName] = item.information;
            return signatures;
          }, containerNameResult);

          var channelIdResult = _.reduce(data.privateSignatures, function(signatures, item){
            signatures[item.channelId] = item.information;
            return signatures;
          }, {});

          return $q.when({
            containerName: containerNameResult,
            channelId: channelIdResult
          });
        });
    };

    return service;
  });
