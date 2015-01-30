angular.module('webApp').factory('authenticationInterceptor',
  function($q, $injector, $location, fifthweekConstants) {
    'use strict';

    var factory = {};
    var $http;
    var authenticationService;

    factory.request = function(config) {

      config.headers = config.headers || {};
      authenticationService = authenticationService || $injector.get('authenticationService');

      if (authenticationService.currentUser.authenticated) {
        config.headers.Authorization = 'Bearer ' + authenticationService.currentUser.accessToken;
      }

      return config;
    };

    factory.responseError = function(rejection) {
      if (rejection.status === 401 && !rejection.config.hasRetried) {
        rejection.config.hasRetried = true;

        authenticationService = authenticationService || $injector.get('authenticationService');

        return authenticationService.refreshToken().then(
          function() {
            return retryHttpRequest(rejection.config);
          },
          function() {
            $location.path(fifthweekConstants.signInPage);
            return $q.reject(rejection);
          });
      }

      return $q.reject(rejection);
    };

    var retryHttpRequest = function(config) {
      $http = $http || $injector.get('$http');
      return $http(config);
    };

    return factory;
  }
);
