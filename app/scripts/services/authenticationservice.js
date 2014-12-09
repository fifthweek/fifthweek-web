/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('authenticationService', ['$http', '$q', 'localStorageService', 'fifthweekConstants',
  function($http, $q, localStorageService, fifthweekConstants) {
    'use strict';

    var apiBaseUri = fifthweekConstants.apiBaseUri;
    var service = {};

    service.currentUser = {
      authenticated: false,
      username: '',
      permissions: []
    };

    service.init = function() {
      var authData = localStorageService.get('authenticationData');
      if (authData) {
        service.currentUser.authenticated = true;
        service.currentUser.username = authData.username;
      }
    };

    service.registerUser = function(internalRegistrationData) {
      service.signOut();
      return $http.post(apiBaseUri + 'membership/registrations', internalRegistrationData);
    };

    service.signIn = function(signInData) {
      service.signOut();

      var data =
        'grant_type=password&username=' + signInData.username +
        '&password=' + signInData.password +
        '&client_id=' + fifthweekConstants.clientId;

      var deferred = $q.defer();

      $http.post(apiBaseUri + 'token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {

        // Performed server-side. Repeated here to make UI consistent with API rules.
        var normalizedUsername = normalizeUsername(signInData.username);

        localStorageService.set('authenticationData', {
          token: response.access_token,
          username: normalizedUsername,
          refreshToken: response.refresh_token
        });

        service.currentUser.authenticated = true;
        service.currentUser.username = normalizedUsername;

        deferred.resolve(response);

      }).error(function(err) {
        service.signOut();
        deferred.reject(err);
      });

      return deferred.promise;
    };

    service.signOut = function() {

      localStorageService.remove('authenticationData');

      service.currentUser.authenticated = false;
      service.currentUser.username = '';
    };

    service.refreshToken = function() {
      var deferred = $q.defer();

      var authData = localStorageService.get('authenticationData');

      if (authData) {

        var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + fifthweekConstants.clientId;

        $http.post(apiBaseUri + 'token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).success(function(response) {

          localStorageService.set('authenticationData', {
            token: response.access_token,
            username: response.username,
            refreshToken: response.refresh_token,
          });

          deferred.resolve(response);

        }).error(function(err) {
          service.signOut();
          deferred.reject(err);
        });
      }
      else {
        deferred.reject('No authentication data available');
      }

      return deferred.promise;
    };

    var normalizeUsername = function(username) {
      return username.trim().toLowerCase();
    };

    return service;
  }
]);

