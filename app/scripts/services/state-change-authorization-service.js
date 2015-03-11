/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeAuthorizationService',
  function($rootScope, authenticationService, authorizationService, authorizationServiceConstants, $state, states, calculatedStates) {
    'use strict';

    var service = {};

    var redirectAfterLogin = false;
    var cachedToState;
    var cachedToParams;

    var getAuthorization = function(toState) {
      return authorizationService.authorize(
        toState.data.access.requireAuthenticated,
        toState.data.access.roles,
        toState.data.access.fwRoleCheckType);
    };

    service.isPermitted = function(toState){
      if (toState.data !== undefined && toState.data.access !== undefined) {
        if (toState.data.access.requireUnauthenticated) {
          return authenticationService.currentUser.authenticated === false;
        }

        return getAuthorization(toState) === authorizationServiceConstants.authorizationResult.authorized;
      }

      return true;
    };

    service.redirectAwayIfRequired = function(event, toState, toParams){
      if (redirectAfterLogin && toState.name !== states.signIn.name) {
        redirectAfterLogin = false;

        if(toState.data !== undefined && toState.data.access !== undefined && toState.data.access.requireAuthenticated === true) {
          event.preventDefault();

          $rootScope.debugLines = $rootScope.debugLines || [];
          $rootScope.debugLines.push('service.redirectAwayIfRequired 3 = ' + toState);

          $state.go(cachedToState, cachedToParams, { location: 'replace' });
        }
      }
      else if (toState.data !== undefined && toState.data.access !== undefined) {
        if (toState.data.access.requireUnauthenticated) {
          if (authenticationService.currentUser.authenticated === true) {
            event.preventDefault();

            $rootScope.debugLines = $rootScope.debugLines || [];
            $rootScope.debugLines.push('service.redirectAwayIfRequired 4 = ' + toState);

            $state.go(calculatedStates.getDefaultState());
          }
        }
        else {
          var authorization = getAuthorization(toState);

          if (authorization === authorizationServiceConstants.authorizationResult.loginRequired) {
            redirectAfterLogin = true;
            cachedToState = toState.name;
            cachedToParams =  toParams;
            event.preventDefault();

            $rootScope.debugLines = $rootScope.debugLines || [];
            $rootScope.debugLines.push('service.redirectAwayIfRequired 5 = ' + toState);

            $state.go(states.signIn.name);
          }
          else if (authorization === authorizationServiceConstants.authorizationResult.notAuthorized) {
            event.preventDefault();

            $rootScope.debugLines = $rootScope.debugLines || [];
            $rootScope.debugLines.push('service.redirectAwayIfRequired 6 = ' + toState);

            $state.go(states.notAuthorized.name);
          }
        }
      }
    };

    return service;
  }
);

