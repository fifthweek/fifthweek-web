angular.module('webApp').factory('impersonationInterceptor',
  function($injector) {
    'use strict';

    var impersonateUserHeaderKey = 'impersonate-user';
    var factory = {};
    var authenticationService;

    factory.request = function(config) {
      authenticationService = authenticationService || $injector.get('authenticationService');
      if(authenticationService.currentUser.nonImpersonatedUserId){
        config.headers = config.headers || {};
        config.headers[impersonateUserHeaderKey] = authenticationService.currentUser.userId;
      }

      return config;
    };

    return factory;
  }
);
