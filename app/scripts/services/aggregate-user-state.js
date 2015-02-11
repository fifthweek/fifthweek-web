angular.module('webApp')
  .constant('aggregateUserStateConstants', {
    updatedEvent: 'aggregateUserStateUpdated'
  })
  .factory('aggregateUserState', function(aggregateUserStateImpl) {
    'use strict';
    aggregateUserStateImpl.initialize();
    return aggregateUserStateImpl;
  })
  .factory('aggregateUserStateImpl',
  function($rootScope, localStorageService, aggregateUserStateConstants, userStateStub) {
  'use strict';

    var localStorageName = 'aggregateUserState';

    var broadcastUpdated = function(){
      $rootScope.$broadcast(aggregateUserStateConstants.updatedEvent, service.currentValue);
    };

    var handleServiceResponse = function(response) {
      service.updateFromDelta(response.data);
    };

    var service = {};

    service.currentValue = null;

    service.initialize = function() {
      var storedUserState = localStorageService.get(localStorageName);
      if (storedUserState) {
        service.currentValue = storedUserState;
      }
    };

    service.updateFromDelta = function(userStateDelta) {
      if (service.currentValue) {
        // Do not mutate state, as other services may have reference to this object (they should also never mutate it!).
        var newUserState = _.cloneDeep(service.currentValue);
        _.merge(newUserState, userStateDelta);
        service.currentValue = newUserState;
      }
      else {
        service.currentValue = userStateDelta;
      }

      localStorageService.set(localStorageName, service.currentValue);
      broadcastUpdated();
    };

    service.updateFromServer = function(userId) {
      if (userId) {
        return userStateStub.getUserState(userId).then(handleServiceResponse);
      }

      return userStateStub.getVisitorState().then(handleServiceResponse);
    };

    return service;
  });
