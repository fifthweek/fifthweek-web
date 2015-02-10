angular.module('webApp').constant('subscriptionServiceConstants', {
  synchronizedEvent: 'subscriptionServiceSynchronized'
  }).factory('subscriptionService',
  function($rootScope, $q, subscriptionServiceConstants, subscriptionStub, aggregateUserStateService, aggregateUserStateServiceConstants) {
    'use strict';

    var subscriptionId = null;

    var broadcastSynchronized = function(){
      $rootScope.$broadcast(subscriptionServiceConstants.synchronizedEvent, subscriptionId);
    };

    var synchronize = function(existingSubscriptionId) {
      subscriptionId = existingSubscriptionId;
      broadcastSynchronized();
    };

    var synchronizeFromUserState = function(userState) {
      if (userState && userState.creatorStatus) {
        synchronize(userState.creatorStatus.subscriptionId);
      }
      else {
        synchronize(null);
      }
    };

    var service = Object.create({}, {
      subscriptionId: { get: function () { return subscriptionId; }},
      hasSubscription: { get: function () { return service.subscriptionId !== null; }}
    });

    service.initialize = function() {
      synchronizeFromUserState(aggregateUserStateService.userState);
      $rootScope.$on(aggregateUserStateServiceConstants.synchronizedEvent, function(event, userState) {
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
