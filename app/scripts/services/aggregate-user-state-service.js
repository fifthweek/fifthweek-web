angular.module('webApp')
  .constant('aggregateUserStateServiceConstants', {
    userStateRefreshedEvent: 'userStateRefreshed'
  }).factory('aggregateUserStateService',
  function($rootScope, localStorageService, aggregateUserStateServiceConstants, userStateStub) {
  'use strict';

    var localStorageName = 'aggregateUserStateService';

    var broadcastUserStateRefreshed = function(){
      $rootScope.$broadcast(aggregateUserStateServiceConstants.userStateRefreshedEvent, service.userState);
    };

    var handleServiceResponse = function(response) {
      service.userState = response.data;
      localStorageService.set(localStorageName, service.userState);
      broadcastUserStateRefreshed();
    };

    var service = {};

    service.userState = null;

    service.initialize = function() {
      var storedUserState = localStorageService.get(localStorageName);
      if (storedUserState) {
        service.userState = storedUserState;
      }
    };

    service.refreshUserState = function(userId) {
      if (userId) {
        return userStateStub.getUserState(userId).then(handleServiceResponse);
      }

      return userStateStub.getVisitorState().then(handleServiceResponse);
    };

    return service;
  });
