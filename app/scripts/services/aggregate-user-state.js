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
  function($rootScope, localStorageService, aggregateUserStateConstants, fetchAggregateUserStateConstants, authenticationServiceConstants) {
  'use strict';

    var localStorageName = 'aggregateUserState';

    var broadcastUpdated = function(){
      $rootScope.$broadcast(aggregateUserStateConstants.updatedEvent, service.currentValue);
    };

    var setNewUserState = function(newUserState){
      service.currentValue = newUserState;
      localStorageService.set(localStorageName, newUserState);
      broadcastUpdated();
    };

    var performMerge = function(isFromServer, userId, userStateDelta){
      var newUserState;
      var validUserStateExists = service.currentValue && service.currentValue.userId === userId;

      if (validUserStateExists) {
        // Do not mutate state, as other services may have reference to this object (they should also never mutate it!).
        newUserState = _.cloneDeep(service.currentValue);
        _.merge(newUserState, userStateDelta);
      }
      else if (isFromServer) {
        newUserState = _.cloneDeep(userStateDelta);

        // The access signatures are never read from this service, so don't store them.
        delete newUserState.accessSignatures;
        newUserState.userId = userId;
      }

      if (newUserState) {
        setNewUserState(newUserState);
      }
    };

    var handleAggregateUserStateFetched = function(event, userId, userState){
      performMerge(true, userId, userState);
    };

    var handleCurrentUserChanged = function(event, newUser){
      if(service.currentValue && newUser.userId !== service.currentValue.userId){
        // The cache is stale, so clear it. New data will be fetched
        // from the server automatically.
        setNewUserState(undefined);
      }
    };

    var service = {};

    service.currentValue = undefined;

    service.initialize = function() {
      var storedUserState = localStorageService.get(localStorageName);
      if (storedUserState) {
        service.currentValue = storedUserState;
      }

      $rootScope.$on(fetchAggregateUserStateConstants.fetchedEvent, handleAggregateUserStateFetched);
      $rootScope.$on(authenticationServiceConstants.currentUserChangedEvent, handleCurrentUserChanged);
    };

    service.updateFromDelta = function(userId, userStateDelta) {
      performMerge(false, userId, userStateDelta);
    };

    return service;
  });
