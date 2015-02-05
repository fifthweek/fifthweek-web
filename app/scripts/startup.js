(function(angular) {
  'use strict';

  angular.module('webApp')
    .config(['$httpProvider',
      function($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
        $httpProvider.interceptors.push('developerRequestInterceptor');
      }
    ])
    .config(function($provide){
      $provide.decorator('$exceptionHandler', function($delegate, logService) {

        return function (exception, cause) {
          $delegate(exception, cause);
          logService.logUnhandledError(exception, cause);
        };
      });
    })
    .run(['$rootScope', 'authenticationService', 'stateChangeAuthorizationHandler', 'stateChangeRedirectionHandler',
      function($rootScope, authenticationService, stateChangeAuthorizationHandler, stateChangeRedirectionHandler) {
        authenticationService.init();

        // Order here is important: they are processed in reverse order.
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
          stateChangeAuthorizationHandler.handleStateChangeStart(event, toState, toParams);
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
          stateChangeRedirectionHandler.handleStateChangeStart(event, toState, toParams);
        });
      }
    ]);
})(angular);

