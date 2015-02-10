angular.module('webApp').factory('subscriptionService',
  function($rootScope, $q, subscriptionStub, aggregateUserStateService, aggregateUserStateServiceConstants) {
    'use strict';

    var subscriptionId = null;

    var synchronizeFromUserState = function(userState) {
      if (userState && userState.creatorStatus) {
        synchronize(userState.creatorStatus.subscriptionId);
      }
      else {
        synchronize(null);
      }
    };

    var synchronize = function(existingSubscriptionId) {
      subscriptionId = existingSubscriptionId;
      // broadcast 'on subscription changed'
    };

    var service = Object.create({}, {
      subscriptionId: { get: function () { return subscriptionId; }},
      hasSubscription: { get: function () { return service.subscriptionId !== null; }}
    });

    service.initialize = function() {
      synchronizeFromUserState(aggregateUserStateService.userState);
      $rootScope.$on(aggregateUserStateServiceConstants.userStateSynchronizedEvent, function(event, userState) {
        synchronizeFromUserState(userState);
      });
    };

    service.createFirstSubscription = function(subscriptionData) {
      if (service.hasSubscription) {
        return $q.reject(new FifthweekError('Subscription already created'));
      }

      return subscriptionStub.postSubscription(subscriptionData).then(function(response) {
        subscriptionId = response.data;
      });
    };

    return service;
  }
);
