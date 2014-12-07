angular.module('webApp').factory('authenticationInterceptorService', ['$q', '$injector', '$location', 'localStorageService',
  function($q, $injector, $location, localStorageService) {
    'use strict';

    var factory = {
      unauthorizedCount: 0
    };
    var $http;

    factory.request = function(config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authenticationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    factory.responseError = function(rejection) {
      if (rejection.status === 401 && !rejection.config.hasRetried) {
        rejection.config.hasRetried = true;

        var authenticationService = $injector.get('authenticationService');

        return authenticationService.refreshToken().then(
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

    return factory;
  }
]);
