angular.module('webApp')
  .constant('fetchAggregateUserStateConstants', {
    fetchedEvent: 'aggregateUserStateFetched'
  })
  .factory('fetchAggregateUserState',
  function($q, $rootScope, fetchAggregateUserStateConstants, userStateStub) {
    'use strict';

    var broadcastUpdated = function(userId, response){
      // This is a basic way of dismissing replies that occur out of order when the user logs in or out.
      // If they occur out of order for the same user it isn't really important.
      if(userId === cache.lastUserId){
        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, response.data);
      }
    };

    var cache = {};
    var service = {};

    service.updateFromServer = function(userId) {

      if(cache.currentRequest){
        if(cache.lastUserId === userId){
          return cache.currentRequest;
        }
      }

      // Keep track of the most recent requested user ID.
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

    service.updateInParallel = function(userId, delegate){
      return $q.all([delegate(),service.updateFromServer(userId)])
        .then(function(result){
          return $q.when(result[0]);
        });
    };

    return service;
  });
