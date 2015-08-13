/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeService',
  function(stateChangeAuthorizationService, stateChangeRedirectionService, stateChangeRequireBlogService) {
    'use strict';

    var stateChangeServices = [
      stateChangeRedirectionService,
      stateChangeAuthorizationService,
      stateChangeRequireBlogService
    ];

    var service = {};

    service.isPermitted = function(toState){
      return _.every(stateChangeServices, function(stateAccessService) {
        return stateAccessService.isPermitted(toState);
      });
    };

    service.redirectAwayIfRequired = function(event, toState, toParams){
      _.forEach(stateChangeServices, function(stateAccessService) {
        if(stateAccessService.redirectAwayIfRequired(event, toState, toParams)){
          return false;
        }
      });
    };

    return service;
  }
);

