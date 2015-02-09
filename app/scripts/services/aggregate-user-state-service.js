angular.module('webApp')
  .constant('aggregateUserStateServiceConstants', {
    userStateRefreshedEvent: 'userStateRefreshed'
  })
  .factory('aggregateUserStateService', function($rootScope, aggregateUserStateServiceConstants, userStateStub) {
  'use strict';

  var broadcastUserStateRefreshed = function(){
    $rootScope.$broadcast(aggregateUserStateServiceConstants.userStateRefreshedEvent, service.userState);
  };

  var service = {};

  service.userState = null;

  service.refreshUserState = function(userId) {
    if (userId) {
      return userStateStub.getUserState(userId).then(function(response) {
        service.userState = response.data;
        broadcastUserStateRefreshed();
      });
    }

    return userStateStub.getVisitorState().then(function(response) {
      service.userState = response.data;
      broadcastUserStateRefreshed();
    });
  };

  return service;
});
