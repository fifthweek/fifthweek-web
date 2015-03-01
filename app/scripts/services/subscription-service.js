angular.module('webApp')
  .factory('subscriptionService', function(subscriptionServiceImpl) {
    'use strict';
    subscriptionServiceImpl.initialize();
    return subscriptionServiceImpl;
  })
  .factory('subscriptionServiceImpl',
  function($rootScope, $q, subscriptionStub, aggregateUserState, aggregateUserStateConstants, authenticationService) {
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

      // We need to store the user ID before posting the new subscription data
      // because it could change during the call.
      var subscriptionUserId = authenticationService.currentUser.userId;
      return subscriptionStub.postSubscription(subscriptionData)
        .then(function(response) {
          var subscriptionId = response.data;
          aggregateUserState.updateFromDelta(
            subscriptionUserId,
            {
              creatorStatus: {
                subscriptionId: subscriptionId
              },
              createdChannelsAndCollections: {
                channels: [
                  {
                    channelId: subscriptionId,
                    name: undefined,
                    collections: []
                  }
                ]
              }
            });
      });
    };

    return service;
  }
);
