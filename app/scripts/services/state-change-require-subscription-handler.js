/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeRequireSubscriptionHandler',
  function($state, calculatedStates, subscriptionService) {
    'use strict';

    var service = {};

    service.handleStateChangeStart = function(event, toState, toParams/*, fromState, fromParams*/){
      if (toState.requireSubscription !== undefined) {
        if (toState.requireSubscription != subscriptionService.hasSubscription) {
          event.preventDefault();
          $state.go(calculatedStates.getDefaultState(), toParams);
        }
      }
    };

    return service;
  }
);

