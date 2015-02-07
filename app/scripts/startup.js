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
      // This configures the empty state '' to have similar properties
      // to the home state.  Because the site is in the default state briefly
      // when the site loads, this ensure that the sidebar doesn't flicker on.
      var allStates = $state.get();
      var homeState = $state.get(states.home.name);
      var emptyState = allStates[0];
      if (emptyState.name !== '') {
        throw new FifthweekError('Failed to find empty state.');
      }

      // We don't copy the entire data structure, because, for example,
      // copying the page css class would cause the landing page background to be downloaded
      // even if we were going directly to a deep link.
      emptyState.data = {
        disableSidebar: homeState.data.disableSidebar,
        bodyClass: 'page-empty'
      };
    })
    .run(function($rootScope, authenticationService, navigationOrchestrator, stateChangeAuthorizationHandler, stateChangeRedirectionHandler, uiRouterConstants) {
      authenticationService.initialize();
      navigationOrchestrator.initialize();

      // Order here is important: they are processed in reverse order.
      $rootScope.$on(uiRouterConstants.stateChangeStartEvent, function(event, toState, toParams) {
        stateChangeAuthorizationHandler.handleStateChangeStart(event, toState, toParams);
      });
      $rootScope.$on(uiRouterConstants.stateChangeStartEvent, function(event, toState, toParams) {
        stateChangeRedirectionHandler.handleStateChangeStart(event, toState, toParams);
      });
    }
  );
})(angular);

