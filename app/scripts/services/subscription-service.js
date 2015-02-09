angular.module('webApp').factory('subscriptionService',
  function($q, subscriptionStub) {
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

    return service;
  }
);
