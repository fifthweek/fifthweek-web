angular.module('webApp')
  .constant('accessSignaturesCacheConstants', {
    // This should match the API.
    // The client will try and refresh access signatures when they are this close to expiring.
    refreshMinimumExpiry: 1000 * 60 * 10,
    failMinimumExpiry: 1000 * 30
  })
  .factory('accessSignaturesCache', function(accessSignaturesCacheImpl){
    'use strict';
    accessSignaturesCacheImpl.initialize();
    return accessSignaturesCacheImpl;
  })
  .factory('accessSignaturesCacheImpl',
  function($rootScope, $q, fetchAggregateUserState, authenticationService, accessSignaturesCacheConstants, fetchAggregateUserStateConstants) {
    'use strict';

    var service = {};
    var cache = {
      lastResult: undefined
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

      return fetchAggregateUserState.updateFromServer(userId)
        .then(function(response) {
          return $q.when(response.userState.accessSignatures);
        })
        .catch(function(error){
          // If the data in the cache is expired with failMinimumExpiry, we're out of chances to retry.
          if (isExpired(accessSignaturesCacheConstants.failMinimumExpiry)){
            return $q.reject(error);
          }

          // Otherwise we failed to update the signatures this time, but still have
          // time to retry later so just return the current data.
          return $q.when(cache.lastResult.data);
        });
    };

    var isExpired = function(minimumExpiry) {
      if(!cache.lastResult){
        return true;
      }

      // We 'expire' the data early so we have multiple opportunities to try and refresh.
      var now = new Date();
      return (cache.lastResult.expires - now.getTime()) < minimumExpiry;
    };

    var refreshRequired = function(userId){
      if (isExpired(accessSignaturesCacheConstants.refreshMinimumExpiry)){
        return true;
      }

      // If the user has logged in or out, we need to refresh.
      return cache.lastResult.userId !== userId;
    };

    var handleAggregateUserStateFetched = function(event, userId, userState){
      updateLastResult(userId, userState.accessSignatures);
    };

    service.getSignatures = function(){
      var userId = authenticationService.currentUser.userId;
      if(refreshRequired(userId)) {
        return fetchNewSignatures(userId);
      }

      return $q.when(cache.lastResult.data);
    };

    service.initialize = function(){
      $rootScope.$on(fetchAggregateUserStateConstants.updateAccessSignaturesEvent, handleAggregateUserStateFetched);
    };

    return service;
  });
