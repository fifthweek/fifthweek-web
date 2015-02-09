angular.module('webApp').factory('subscriptionService',
  function($rootScope, $q, subscriptionStub, aggregateUserStateServiceConstants) {
    'use strict';

    var subscriptionId = null;

    var service = Object.create({}, {
      subscriptionId: { get: function () { return subscriptionId; }},
      hasSubscription: { get: function () { return service.subscriptionId !== null; }}
    });

    service.synchronize = function(existingSubscriptionId) {
      subscriptionId = existingSubscriptionId;
    };

    service.createFirstSubscription = function(subscriptionData) {
      if (service.hasSubscription) {
        return $q.reject(new FifthweekError('Subscription already created'));
      }

      return subscriptionStub.postSubscription(subscriptionData).then(function(response) {
        subscriptionId = response.data;
      });
    };

    $rootScope.$on(aggregateUserStateServiceConstants.userStateRefreshedEvent, function(event, userState) {
      if (userState.creatorStatus) {
        service.synchronize(userState.creatorStatus.subscriptionId);
      }
      else {
        service.synchronize(null);
      }
    });

    return service;
  }
);
