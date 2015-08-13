angular.module('webApp').factory('authenticationInterceptor',
  function($q, $injector, states, fifthweekConstants) {
    'use strict';

    var service = {};
    var $http;
    var $state;
    var authenticationService;

    service.currentTokenRequest = undefined;

    var retryHttpRequest = function(config) {
      $http = $http || $injector.get('$http');
      return $http(config);
    };

    var refreshToken = function(){
      if(!service.currentTokenRequest){
        service.currentTokenRequest = authenticationService.refreshToken();

        // Do this here to ensure it only happens once even if multiple requests
        // hook into the current promise.
        service.currentTokenRequest
          .catch(function(){
            $state = $state || $injector.get('$state');
            $state.go(states.signIn.signIn.name);
          })
          .finally(function(){
            service.currentTokenRequest = undefined;
          });
      }

      return service.currentTokenRequest;
    };

    service.request = function(config) {

      config.headers = config.headers || {};

      authenticationService = authenticationService || $injector.get('authenticationService');
      if (authenticationService.currentUser.authenticated && _.startsWith(config.url, fifthweekConstants.apiBaseUri)) {
        config.headers.Authorization = 'Bearer ' + authenticationService.currentUser.accessToken;
      }

      return config;
    };

    service.responseError = function(rejection) {
      if (rejection.status === 401 && !rejection.config.hasRetried) {
        rejection.config.hasRetried = true;

        authenticationService = authenticationService || $injector.get('authenticationService');
        return refreshToken().then(
          function() {
            return retryHttpRequest(rejection.config);
          },
          function() {
            return $q.reject(rejection);
          });
      }

      return $q.reject(rejection);
    };

    return service;
  }
);
