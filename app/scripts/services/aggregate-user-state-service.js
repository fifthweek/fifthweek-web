angular.module('webApp')
  .constant('aggregateUserStateServiceConstants', {
    synchronizedEvent: 'aggregateUserStateServiceSynchronized'
  })
  .factory('aggregateUserStateService', function(aggregateUserStateServiceImpl) {
    'use strict';
    aggregateUserStateServiceImpl.initialize();
    return aggregateUserStateServiceImpl;
  })
  .factory('aggregateUserStateServiceImpl',
  function($rootScope, localStorageService, aggregateUserStateServiceConstants, userStateStub) {
  'use strict';

    var localStorageName = 'aggregateUserStateService';

    var broadcastSynchronized = function(){
      $rootScope.$broadcast(aggregateUserStateServiceConstants.synchronizedEvent, service.userState);
    };

    var handleServiceResponse = function(response) {
      service.synchronize(response.data);
    };

    var service = {};

    service.userState = null;

    service.initialize = function() {
      var storedUserState = localStorageService.get(localStorageName);
      if (storedUserState) {
        service.userState = storedUserState;
      }
    };

    service.synchronize = function(newUserState) {
      service.userState = newUserState;
      localStorageService.set(localStorageName, service.userState);
      broadcastSynchronized();
    };

    service.synchronizeWithServer = function(userId) {
      if (userId) {
        return userStateStub.getUserState(userId).then(handleServiceResponse);
      }

      return userStateStub.getVisitorState().then(handleServiceResponse);
    };

    return service;
  });
