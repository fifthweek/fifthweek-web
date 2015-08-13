/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeRequireBlogService',
  function($state, calculatedStates, blogService) {
    'use strict';

    var service = {};

    service.isPermitted = function(toState){
      if (toState.requireBlog !== undefined) {
        if (toState.requireBlog !== blogService.hasBlog) {
          return false;
        }
      }

      return true;
    };

    service.redirectAwayIfRequired = function(event, toState, toParams/*, fromState, fromParams*/){
      if (!service.isPermitted(toState)) {
        event.preventDefault();
        $state.go(calculatedStates.getDefaultState(), toParams);
        return true;
      }

      return false;
    };

    return service;
  }
);

