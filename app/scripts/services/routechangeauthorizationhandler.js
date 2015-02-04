/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('routeChangeAuthorizationHandler',
  function(authorizationService, authorizationServiceConstants, $state, states) {
    'use strict';

    var service = {};

    var routeChangeRequiredAfterLogin = false;
    var cachedToState;
    var cachedToParams;

    service.handleStateChangeStart = function(event, toState, toParams/*, fromState, fromParams*/){

      if (routeChangeRequiredAfterLogin && toState.name !== states.signIn.name) {
        routeChangeRequiredAfterLogin = false;

        if(toState.data !== undefined && toState.data.access !== undefined && toState.data.access.loginRequired === true) {
          event.preventDefault();
          $state.go(cachedToState, cachedToParams, { location: 'replace' });
        }
      }
      else if (toState.data !== undefined && toState.data.access !== undefined) {
        var authorised = authorizationService.authorize(
          toState.data.access.loginRequired,
          toState.data.access.roles,
          toState.data.access.roleCheckType);

        if (authorised === authorizationServiceConstants.authorizationResult.loginRequired) {
          routeChangeRequiredAfterLogin = true;
          cachedToState = toState.name;
          cachedToParams =  toParams;
          event.preventDefault();
          $state.go(states.signIn.name);
        }
        else if (authorised === authorizationServiceConstants.authorizationResult.notAuthorized) {
          event.preventDefault();
          $state.go(states.notAuthorized.name);
        }
      }
    };

    return service;
  }
);

