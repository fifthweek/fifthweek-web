(function(angular) {
  'use strict';

  angular.module('webApp')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
        $httpProvider.interceptors.push('developerRequestInterceptor');
      }
    )
    .config(function($provide){
      $provide.decorator('$exceptionHandler', function($delegate, logService) {

        return function (exception, cause) {
          $delegate(exception, cause);
          logService.logUnhandledError(exception, cause);
        };
      });
    })
    .run(function ($state, states) {
      // This configures the default state '' to have the same data properties
      // as the home state.  Because the site is in the default state briefly
      // when the site loads, this ensure that the sidebar doesn't flicker on.
      var allStates = $state.get();
      var homeState = $state.get(states.home.name);
      var defaultState = allStates[0];
      if (defaultState.name !== '') {
        throw new FifthweekError('Failed to find default state.');
      }
      defaultState.data = homeState.data;
    })
    .run(function($rootScope, authenticationService, stateChangeAuthorizationHandler, stateChangeRedirectionHandler) {
        authenticationService.init();

        // Order here is important: they are processed in reverse order.
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
          stateChangeAuthorizationHandler.handleStateChangeStart(event, toState, toParams);
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
          stateChangeRedirectionHandler.handleStateChangeStart(event, toState, toParams);
        });
      }
    );
})(angular);

