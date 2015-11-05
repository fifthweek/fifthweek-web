angular.module('webApp')
  .constant('fetchAggregateUserStateConstants', {
    updateAccessSignaturesEvent: 'updateAccessSignatures',
    fetchedEvent: 'aggregateUserStateFetched',
    refreshIfStaleMilliseconds: 30 * 60 * 1000
  })
  .factory('fetchAggregateUserState',
  function($q, $rootScope, fetchAggregateUserStateConstants, userStateStub) {
    'use strict';

    var broadcastUpdated = function(userId, response){
      // This is a basic way of dismissing replies that occur out of order when the user logs in or out.
      // If they occur out of order for the same user it isn't really important.
      if(userId === cache.lastUserId){
        // We allow the access signatures cache to update before notifying everyone else, otherwise
        // we can get in a loop of requesting a new user state because access signatures were stale.
        $rootScope.$broadcast(fetchAggregateUserStateConstants.updateAccessSignaturesEvent, userId, response.data);
        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, response.data);
      }

      return $q.when({
        userId: userId,
        userState: response.data
      });
    };

    var isStale = function(){
      var now = new Date();
      return !cache.lastUpdate ||
        (now.getTime() - cache.lastUpdate) >= fetchAggregateUserStateConstants.refreshIfStaleMilliseconds;
    };

    var cache = {};
    var service = {
      internal: {
        cache: cache
      }
    };

    service.updateFromServer = function(userId) {

      if(cache.currentRequest){
        if(cache.lastUserId === userId){
          return cache.currentRequest;
        }
      }

      // Keep track of the most recent requested user ID.
      var now = new Date();
      cache.lastUpdate = now.getTime();
      cache.lastUserId = userId;
      cache.currentRequest = undefined;

      var handleResponse = _.curry(broadcastUpdated)(userId);
      var promise;
      if (userId) {
        promise = userStateStub.getUserState(userId).then(handleResponse);
      }
      else{
        promise = userStateStub.getVisitorState().then(handleResponse);
      }

      cache.currentRequest = promise;
      promise.finally(function(){
        cache.currentRequest = undefined;
      });

      return promise;
    };

    service.updateIfStale = function(userId){
      return service.waitForExistingUpdate()
        .then(function(){
          if(isStale() || cache.lastUserId !== userId) {
            return service.updateFromServer(userId);
          }

          return $q.when();
        });
    };

    service.waitForExistingUpdate = function(){
      if(cache.currentRequest){
        return cache.currentRequest.then(function(){
          return $q.when(true);
        });
      }

      return $q.when(false);
    };

    service.updateInParallel = function(userId, delegate){
      return $q.all([delegate(),service.updateFromServer(userId)])
        .then(function(result){
          return $q.when(result[0]);
        });
    };

    return service;
  });
