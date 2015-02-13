angular.module('webApp')
  .constant('fetchAggregateUserStateConstants', {
    fetchedEvent: 'aggregateUserStateFetched'
  })
  .factory('fetchAggregateUserState',
  function($rootScope, fetchAggregateUserStateConstants, userStateStub) {
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
      // Keep track of the most recent requested user ID.
      cache.lastUserId = userId;

      var handleResponse = _.curry(broadcastUpdated)(userId);
      if (userId) {
        return userStateStub.getUserState(userId).then(handleResponse);
      }
      return userStateStub.getVisitorState().then(handleResponse);
    };

    return service;
  });
