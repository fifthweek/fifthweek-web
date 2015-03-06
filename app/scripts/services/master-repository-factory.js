angular.module('webApp').factory('masterRepositoryFactory', function($q, aggregateUserState, authenticationService, utilities) {
  'use strict';

  return {
    forCurrentUser: function() {

      var service = {};

      // The ID must be scoped to the lifetime of this repository, since this repository represents channels for a
      // particular user.
      var currentUserId = authenticationService.currentUser.userId;

      var userChanged = function() {
        return !authenticationService.currentUser || authenticationService.currentUser.userId !== currentUserId;
      };

      service.set = function(key, applyChanges){
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
          var delta = {};
          var leaf = delta;
          for (var i = 0; i < pathSegments.length; i++) {
            var isLastSegment = i === pathSegments.length - 1;
            leaf[pathSegments[i]] = isLastSegment ? clonedValue : {};
            leaf = leaf[pathSegments[i]];
          }

          aggregateUserState.updateFromDelta(currentUserId, delta);
        });
      };

      service.get = function(key){
        if (userChanged()) {
          return $q.reject(new FifthweekError('Repository not valid for current user.'));
        }

        if (!aggregateUserState.currentValue) {
          return $q.reject(new FifthweekError('No aggregate state found.'));
        }

        var directValue = utilities.getValue(aggregateUserState.currentValue, key);

        if (directValue === undefined) {
          return $q.reject(new FifthweekError('The key "' + key + '" does not match anything within the aggregate user state.'));
        }

        var clonedValue = _.cloneDeep(directValue);

        return $q.when(clonedValue);
      };

      return service;
    }
  };
});
