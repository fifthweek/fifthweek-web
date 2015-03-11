/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeRequireSubscriptionService',
  function($rootScope, $state, calculatedStates, subscriptionService) {
    'use strict';

    var service = {};

    service.isPermitted = function(toState){
      if (toState.requireSubscription !== undefined) {
        $rootScope.debugLines = $rootScope.debugLines || [];
        $rootScope.debugLines.push('subscriptionService.hasSubscription 3 = ' + subscriptionService.hasSubscription);
        if (toState.requireSubscription !== subscriptionService.hasSubscription) {
          return false;
        }
      }

      return true;
    };

    service.redirectAwayIfRequired = function(event, toState, toParams/*, fromState, fromParams*/){
      if (!service.isPermitted(toState)) {
        event.preventDefault();
        $state.go(calculatedStates.getDefaultState(), toParams);
      }
    };

    return service;
  }
);

