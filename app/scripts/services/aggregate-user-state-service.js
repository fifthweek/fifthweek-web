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

  service.refreshUserState = function() {
    return userStateStub.get().then(function(response) {
      service.userState = response.data;
      broadcastUserStateRefreshed();
    });
  };

  return service;
});
