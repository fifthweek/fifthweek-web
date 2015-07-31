angular.module('webApp').factory('impersonationInterceptor',
  function(fifthweekConstants, impersonationService) {
    'use strict';

    var impersonateUserHeaderKey = 'impersonate-user';
    var factory = {};

    factory.request = function(config) {
      if(impersonationService.impersonatedUserId){
        config.headers = config.headers || {};
        config.headers[impersonateUserHeaderKey] = impersonationService.impersonatedUserId;
      }

      return config;
    };

    return factory;
  }
);
