angular.module('webApp')
  .config(['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptorService');
    }
  ])
  .run(['authService',
    function(authService) {
      authService.fillAuthData();
    }
  ]);