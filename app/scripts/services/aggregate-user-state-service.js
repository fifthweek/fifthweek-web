angular.module('webApp')
  .constant('aggregateUserStateServiceConstants', {
    updatedEvent: 'aggregateUserStateServiceUpdated'
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
      $rootScope.$broadcast(aggregateUserStateServiceConstants.updatedEvent, service.userState);
    };

    var handleServiceResponse = function(response) {
      service.updateFromDelta(response.data);
    };

    var service = {};

    service.userState = null;

    service.initialize = function() {
      var storedUserState = localStorageService.get(localStorageName);
      if (storedUserState) {
        service.userState = storedUserState;
      }
    };

    service.updateFromDelta = function(userStateDelta) {
      if (service.userState) {
        // Do not mutate state, as other services may have reference to this object (they should also never mutate it!).
        var newUserState = _.cloneDeep(service.userState);
        _.merge(newUserState, userStateDelta);
        service.userState = newUserState;
      }
      else {
        service.userState = userStateDelta;
      }

      localStorageService.set(localStorageName, service.userState);
      broadcastSynchronized();
    };

    service.updateFromServer = function(userId) {
      if (userId) {
        return userStateStub.getUserState(userId).then(handleServiceResponse);
      }

      return userStateStub.getVisitorState().then(handleServiceResponse);
    };

    return service;
  });
