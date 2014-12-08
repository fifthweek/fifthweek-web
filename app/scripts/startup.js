angular.module('webApp')
  .config(['$httpProvider',
    function($httpProvider) {
      'use strict';

      $httpProvider.interceptors.push('authenticationInterceptor');
    }
  ])
  .run(['$rootScope', 'authenticationService', 'routeChangeAuthorizationHandler',
    function($rootScope, authenticationService, routeChangeAuthHandler) {
      'use strict';

      authenticationService.fillAuthData();

      $rootScope.$on('$routeChangeStart', function(event, next) {
          routeChangeAuthHandler.handleRouteChangeStart(next);
      });
    }
  ]);

