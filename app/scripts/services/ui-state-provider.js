angular.module('webApp').factory('uiStateProvider',
  function($q, states, subscriptionService, authenticationService, authenticationServiceConstants) {
    'use strict';

    var service = {};

    service.getDefaultState = function() {
      var currentUser = authenticationService.currentUser;

      if (currentUser.authenticated === true) {
        if (_.includes(currentUser.roles, authenticationServiceConstants.roles.creator)) {
          if (subscriptionService.hasSubscription) {
            return states.dashboard.demo;
          }
          else {
            return states.creators.createSubscription;
          }
        }
        else {
          return states.home;
        }
      }
      else {
        return states.home;
      }
    };

    return service;
  }
);
