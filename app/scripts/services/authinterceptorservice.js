angular.module('webApp').factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService',
  function($q, $injector, $location, localStorageService) {
    'use strict';

    var authInterceptorServiceFactory = {
      unauthorizedCount: 0
    };
    var $http;

    authInterceptorServiceFactory.request = function(config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authenticationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    authInterceptorServiceFactory.responseError = function(rejection) {
      if (rejection.status === 401 && !rejection.config.hasRetried) {
        rejection.config.hasRetried = true;

        var authService = $injector.get('authService');

        return authService.refreshToken().then(
          function() {
            var deferred = $q.defer();
            retryHttpRequest(rejection.config, deferred);
            return deferred.promise;
          },
          function() {
            $location.path('/signin');
            return $q.reject(rejection);
          });
      }

      return $q.reject(rejection);
    };

    var retryHttpRequest = function(config, deferred) {
      $http = $http || $injector.get('$http');

      $http(config).then(
        function(response) {
          deferred.resolve(response);
        },
        function(response) {
          deferred.reject(response);
        });
    };

    return authInterceptorServiceFactory;
  }
]);