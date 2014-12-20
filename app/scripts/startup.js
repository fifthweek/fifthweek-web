(function(angular) {
  'use strict';

  angular.module('webApp')
    .config(['$httpProvider',
      function($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
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
      function($rootScope, authenticationService, routeChangeAuthHandler) {
        authenticationService.init();

        $rootScope.$on('$routeChangeStart', function(event, next) {
          routeChangeAuthHandler.handleRouteChangeStart(next);
        });
      }
    ]);
})(angular);

