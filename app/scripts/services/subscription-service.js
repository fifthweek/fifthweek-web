angular.module('webApp')
  .factory('subscriptionService', function(subscriptionServiceImpl) {
    'use strict';
    subscriptionServiceImpl.initialize();
    return subscriptionServiceImpl;
  })
  .factory('subscriptionServiceImpl',
  function($rootScope, $q, subscriptionStub, aggregateUserState, aggregateUserStateConstants) {
    'use strict';

    var subscriptionId = null;

    var synchronizeFromUserState = function(userState) {
      if (userState && userState.creatorStatus) {
        subscriptionId = userState.creatorStatus.subscriptionId;
      }
      else {
        subscriptionId = null;
      }
    };

    var service = Object.create({}, {
      subscriptionId: { get: function () { return subscriptionId; }},
      hasSubscription: { get: function () { return service.subscriptionId !== null; }}
    });

    service.initialize = function() {
      synchronizeFromUserState(aggregateUserState.currentValue);
      $rootScope.$on(aggregateUserStateConstants.updatedEvent, function(event, userState) {
        synchronizeFromUserState(userState);
      });
    };

    service.createFirstSubscription = function(subscriptionData) {
      if (service.hasSubscription) {
        return $q.reject(new FifthweekError('Subscription already created'));
      }

      return subscriptionStub.postSubscription(subscriptionData).then(function(response) {
        aggregateUserState.updateFromDelta({
          creatorStatus: {
            subscriptionId: response.data
          }
        });
      });
    };

    return service;
  }
);
