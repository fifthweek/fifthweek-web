angular.module('webApp').factory('calculatedStates',
  function($q, states, subscriptionService, authenticationService, authenticationServiceConstants) {
    'use strict';

    var service = {};

    service.getDefaultState = function() {
      var currentUser = authenticationService.currentUser;

      if (currentUser.authenticated === true) {
        if (_.includes(currentUser.roles, authenticationServiceConstants.roles.creator)) {
          if (subscriptionService.hasSubscription) {
            return states.creators.compose.note.name;
          }
          else {
            return states.creators.createSubscription.name;
          }
        }
        else {
          return states.creators.compose.note.name;
        }
      }
      else {
        return states.home.name;
      }
    };

    return service;
  }
);
