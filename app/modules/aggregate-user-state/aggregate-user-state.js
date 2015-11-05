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
  function($rootScope, localStorageService, aggregateUserStateConstants, fetchAggregateUserStateConstants, authenticationServiceConstants, utilities) {
  'use strict';

    var localStorageName = 'aggregateUserState';
    var initialized = false;

    var broadcastUpdated = function(){
      $rootScope.$broadcast(aggregateUserStateConstants.updatedEvent, service.currentValue);
    };

    var setNewUserState = function(newUserState){
      service.currentValue = newUserState;
      service.isCurrentValueStale = false;
      localStorageService.set(localStorageName, newUserState);
      broadcastUpdated();
    };

    var handleAggregateUserStateFetched = function(event, userId, userState){
      userState = _.cloneDeep(userState);

      // The access signatures are never read from this service, so don't store them.
      delete userState.accessSignatures;
      userState.userId = userId;

      setNewUserState(userState);
    };

    var handleCurrentUserChanged = function(event, newUser){
      if(service.currentValue && newUser.userId !== service.currentValue.userId){
        // The cache is stale, so mark it as cleared. New data will be fetched
        // from the server automatically.
        service.isCurrentValueStale = true;
      }
    };

    var service = {};

    service.currentValue = undefined;
    service.isCurrentValueStale = true;

    service.initialize = function() {
      if (initialized) {
        throw new FifthweekError('Aggregate user state already initialized');
      }

      initialized = true;

      service.currentValue = localStorageService.get(localStorageName);
      service.isCurrentValueStale = true;

      $rootScope.$on(fetchAggregateUserStateConstants.fetchedEvent, handleAggregateUserStateFetched);
      $rootScope.$on(authenticationServiceConstants.currentUserChangedEvent, handleCurrentUserChanged);
    };

    service.setDelta = function(userId, key, userStateDelta) {
      if (!service.currentValue || service.currentValue.userId !== userId) {
        return;
      }

      var keySegments = _.isArray(key) ? key : utilities.getAccessorPathSegments(key);
      if (keySegments.length === 0 || keySegments[0].length === 0) {
        throw new FifthweekError('Cannot set directly to aggregate root.');
      }

      var newUserState = _.cloneDeep(service.currentValue);
      var parentObject = utilities.getValue(newUserState, _.initial(keySegments));

      if (parentObject === undefined) {
        throw new FifthweekError('Parent object for "' + key + '" does not exist in existing aggregate state');
      }

      parentObject[_.last(keySegments)] = userStateDelta;
      setNewUserState(newUserState);
    };

    return service;
  });
