angular.module('webApp')
  .constant('accessSignaturesConstants', {
    refreshMinimumExpiry: 1000 * 60 * 10,
    failMinimumExpiry: 1000 * 30,
    refreshUri: 'userAccessSignatures'
  })
  .factory('accessSignatures', function(accessSignaturesImpl){
      'use strict';
      accessSignaturesImpl.initialize();
    return accessSignaturesImpl;
  })
  .factory('accessSignaturesImpl',
  function($rootScope, $http, $q, fifthweekConstants, authenticationService, utilities, accessSignaturesConstants, fetchAggregateUserStateConstants) {
    'use strict';

    var service = {};
    var cache = {
      lastResult: undefined,
      currentQuery: undefined,
      nextId: 0
    };

    var updateLastResult = function(userId, newResult){
      var now = new Date();
      var expires = now.getTime() + newResult.timeToLiveSeconds * 1000;

      cache.lastResult = {
        expires: expires,
        userId: userId,
        data: newResult
      };
    };

    var fetchNewSignatures = function(userId){
      // If there is a refresh occurring and the user ID matches, just return
      // the existing promise.
      if(cache.currentQuery && cache.currentQuery.userId === userId) {
        return cache.currentQuery.promise;
      }

      var uri = fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri;
      if (userId){
        uri = uri + '/' + userId;
      }

      var id = cache.nextId++;

      // Update the current query here before we have the promise,
      // just in case the HTTP result returns immediate.
      // In reality this won't happen, but theoretically it could
      // when mocking, etc.
      cache.currentQuery = {
        userId: userId,
        id: id,
        promise: undefined
      };

      var promise = $http.get(uri).then(function(response) {

        // Only update the cache if the another query hasn't been
        // executed since this one. This could happen when the user logs
        // in while a previous query was executing.
        if(cache.currentQuery && cache.currentQuery.id === id){
          cache.currentQuery = undefined;
          updateLastResult(userId, response.data);
        }

        return $q.when(response.data);
      }, function(response){

        // Only update the cache if the another query hasn't been
        // executed since this one. This could happen when the user logs
        // in while a previous query was executing.
        if(cache.currentQuery && cache.currentQuery.id === id) {
          cache.currentQuery = undefined;
        }

        // If the data in the cache is expired with failMinimumExpiry, we're out of chances to retry.
        if (isExpired(accessSignaturesConstants.failMinimumExpiry)){
          return $q.reject(utilities.getHttpError(response));
        }

        // Otherwise we failed to update the signatures this time, but still have
        // time to retry later so just return the current data.
        return $q.when(cache.lastResult.data);
      });

      // We don't need to check the current query ID here as this will always be
      // called synchronously with setting the new query.
      cache.currentQuery.promise = promise;

      return promise;
    };

    var isExpired = function(minimumExpiry) {
      if(!cache.lastResult){
        return true;
      }

      // We 'expire' the data early so we have multiple opportunities to try and refresh.
      var now = new Date();
      if((cache.lastResult.expires - now.getTime()) < minimumExpiry){
        return true;
      }

      return false;
    };

    var refreshRequired = function(userId){
      if (isExpired(accessSignaturesConstants.refreshMinimumExpiry)){
        return true;
      }

      // If the user has logged in or out, we need to refresh.
      if (cache.lastResult.userId !== userId){
        return true;
      }

      return false;
    };

    var getSignatures = function(userId){
      if(refreshRequired(userId)) {
        return fetchNewSignatures(userId);
      }

      return $q.when(cache.lastResult.data);
    };

    var handleAggregateUserStateFetched = function(event, userId, userState){
      updateLastResult(userId, userState.accessSignatures);
    };

    service.getAccessInformation = function(creatorId){
      var userId = authenticationService.currentUser.userId;

      return getSignatures(userId).then(function(data){
        if (creatorId){
          var privateSignatures = data.privateSignatures;
          if (privateSignatures){
            for(var i = 0; i < privateSignatures.length; i++){
              if(privateSignatures[i].creatorId === creatorId){
                return privateSignatures[i].information;
              }
            }
          }
          return $q.reject(new FifthweekError('No shared access signatures found for creator: ' + creatorId));
        }else{
          return data.publicSignature;
        }
      });
    };

    service.initialize = function(){
      $rootScope.$on(fetchAggregateUserStateConstants.fetchedEvent, handleAggregateUserStateFetched);
    };

    return service;
  });
