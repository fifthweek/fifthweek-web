angular.module('webApp').factory('calculatedStates',
  function($q, states, blogService, authenticationService, authenticationServiceConstants) {
    'use strict';

    var service = {};

    service.getDefaultState = function() {
      var currentUser = authenticationService.currentUser;

      if (currentUser.authenticated === true) {
        if (_.includes(currentUser.roles, authenticationServiceConstants.roles.creator)) {
          if (blogService.hasBlog) {
            return states.dashboard.name;
          }
          else {
            return states.creators.createBlog.name;
          }
        }
        else {
          return states.dashboard.name;
        }
      }
      else {
        return states.home.name;
      }
    };

    return service;
  }
);
