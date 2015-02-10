/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeAuthorizationService',
  function(authorizationService, authorizationServiceConstants, $state, states) {
    'use strict';

    var service = {};

    var redirectAfterLogin = false;
    var cachedToState;
    var cachedToParams;

    var getAuthorization = function(toState) {
      return authorizationService.authorize(
        toState.data.access.loginRequired,
        toState.data.access.roles,
        toState.data.access.fwRoleCheckType);
    };

    service.isPermitted = function(toState){
      if (toState.data !== undefined && toState.data.access !== undefined) {
        return getAuthorization(toState) === authorizationServiceConstants.authorizationResult.authorized;
      }

      return true;
    };

    service.redirectAwayIfRequired = function(event, toState, toParams){
      if (redirectAfterLogin && toState.name !== states.signIn.name) {
        redirectAfterLogin = false;

        if(toState.data !== undefined && toState.data.access !== undefined && toState.data.access.loginRequired === true) {
          event.preventDefault();
          $state.go(cachedToState, cachedToParams, { location: 'replace' });
        }
      }
      else if (toState.data !== undefined && toState.data.access !== undefined) {
        var authorization = getAuthorization(toState);

        if (authorization === authorizationServiceConstants.authorizationResult.loginRequired) {
          redirectAfterLogin = true;
          cachedToState = toState.name;
          cachedToParams =  toParams;
          event.preventDefault();
          $state.go(states.signIn.name);
        }
        else if (authorization === authorizationServiceConstants.authorizationResult.notAuthorized) {
          event.preventDefault();
          $state.go(states.notAuthorized.name);
        }
      }
    };

    return service;
  }
);

