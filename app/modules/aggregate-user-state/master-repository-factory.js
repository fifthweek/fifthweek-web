angular.module('webApp').factory('masterRepositoryFactory', function($q, aggregateUserState, authenticationService, utilities, fetchAggregateUserState) {
  'use strict';

  return {
    forCurrentUser: function() {

      var service = {};

      var internal = service.internal = {};

      // The ID must be scoped to the lifetime of this repository, since this repository represents channels for a
      // particular user.
      var currentUserId = authenticationService.currentUser.userId;

      var userChanged = function() {
        return !authenticationService.currentUser || authenticationService.currentUser.userId !== currentUserId;
      };

      internal.ensureUserState = function(){
        return fetchAggregateUserState.waitForExistingUpdate()
          .then(function(){
            if (!aggregateUserState.currentValue || aggregateUserState.isCurrentValueStale) {
              return fetchAggregateUserState.updateFromServer();
            }

            return $q.when();
          });
      };

      service.getUserId = function(){
        return currentUserId;
      };

      service.set = function(key, newValue){
        if (userChanged()) {
          return $q.when(); // Fail silently when user changes.
        }
        if (!aggregateUserState.currentValue) {
          return $q.reject(new FifthweekError('No aggregate state found.'));
        }

        var clonedValue = _.cloneDeep(newValue);

        aggregateUserState.setDelta(currentUserId, key, clonedValue);

        return $q.when();
      };

      service.update = function(key, applyChanges){
        if (userChanged()) {
          return $q.when(); // Fail silently when user changes.
        }
        if (!aggregateUserState.currentValue) {
          return $q.reject(new FifthweekError('No aggregate state found.'));
        }

        var pathSegments = utilities.getAccessorPathSegments(key);
        var directValue = utilities.getValue(aggregateUserState.currentValue, pathSegments);

        if (directValue === undefined) {
          return $q.reject(new FifthweekError('The key "' + key + '" does not match anything within the aggregate user state.'));
        }

        var clonedValue = _.cloneDeep(directValue);

        var applyChangesPromise;
        try {
          applyChangesPromise = $q.when(applyChanges(clonedValue));
        }
        catch(error) {
          applyChangesPromise = $q.reject(error);
        }

        return applyChangesPromise.then(function() {
          aggregateUserState.setDelta(currentUserId, key, clonedValue);
        });
      };

      service.get = function(key, allowUnmatched){
        if (userChanged()) {
          return $q.reject(new FifthweekError('Repository not valid for current user.'));
        }

        return internal.ensureUserState()
          .then(function(){
            var directValue = utilities.getValue(aggregateUserState.currentValue, key);

            if (directValue === undefined) {
              if(allowUnmatched){
                return $q.when();
              }

              return $q.reject(new FifthweekError('The key "' + key + '" does not match anything within the aggregate user state.'));
            }

            var clonedValue = _.cloneDeep(directValue);

            return $q.when(clonedValue);
          });
      };

      return service;
    }
  };
});
