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
    .run(['$rootScope', 'authenticationService', 'routeChangeAuthorizationHandler',
      function($rootScope, authenticationService, routeChangeAuthorizationHandler, states) {
        authenticationService.init();
        $rootScope.states = states;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
          routeChangeAuthorizationHandler.handleStateChangeStart(event, toState, toParams);
        });
      }
    ]);
})(angular);

