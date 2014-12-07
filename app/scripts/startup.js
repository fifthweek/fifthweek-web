angular.module('webApp')
  .config(['$httpProvider',
    function($httpProvider) {
      'use strict';

      $httpProvider.interceptors.push('authInterceptorService');
    }
  ])
  .run(['$rootScope', 'authService', 'routeChangeAuthHandler',
    function($rootScope, authService, routeChangeAuthHandler) {
      'use strict';

      authService.fillAuthData();

      $rootScope.$on('$routeChangeStart', function(event, next) {
          routeChangeAuthHandler.handleRouteChangeStart(next);
      });
    }
  ]);
