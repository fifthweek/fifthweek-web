/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('routeChangeAuthorizationHandler',
  function(authorizationService, authorizationServiceConstants, $state, states) {
    'use strict';

    var service = {};

    var routeChangeRequiredAfterLogin = false;
    var loginRedirectState;

    service.handleStateChangeStart = function(event, toState/*, toParams, fromState, fromParams*/){

      var state = $state.get(toState);

      if (routeChangeRequiredAfterLogin && toState !== states.signIn.name) {

        routeChangeRequiredAfterLogin = false;

        if(state.access !== undefined && state.access.loginRequired === true) {
          event.preventDefault();
          $state.go(loginRedirectState);
        }
      }
      else if (state.access !== undefined) {
        var authorised = authorizationService.authorize(
          state.access.loginRequired,
          state.access.roles,
          state.access.roleCheckType);

        if (authorised === authorizationServiceConstants.authorizationResult.loginRequired) {
          routeChangeRequiredAfterLogin = true;
          loginRedirectState = toState;
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

