angular.module('webApp')
  .constant('aggregateUserStateServiceConstants', {
    userStateSynchronizedEvent: 'userStateSynchronized'
  }).factory('aggregateUserStateService',
  function($rootScope, localStorageService, aggregateUserStateServiceConstants, userStateStub) {
  'use strict';

    var localStorageName = 'aggregateUserStateService';

    var broadcastUserStateSynchronized = function(){
      $rootScope.$broadcast(aggregateUserStateServiceConstants.userStateSynchronizedEvent, service.userState);
    };

    var handleServiceResponse = function(response) {
      service.userState = response.data;
      localStorageService.set(localStorageName, service.userState);
      broadcastUserStateSynchronized();
    };

    var service = {};

    service.userState = null;

    service.initialize = function() {
      var storedUserState = localStorageService.get(localStorageName);
      if (storedUserState) {
        service.userState = storedUserState;
      }
    };

    service.synchronizeWithServer = function(userId) {
      if (userId) {
        return userStateStub.getUserState(userId).then(handleServiceResponse);
      }

      return userStateStub.getVisitorState().then(handleServiceResponse);
    };

    return service;
  });
