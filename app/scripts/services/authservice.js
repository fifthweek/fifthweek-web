/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('authService', ['$http', '$q', 'localStorageService', 'webSettings',
  function($http, $q, localStorageService, webSettings) {
    'use strict';

    var apiBaseUri = webSettings.apiBaseUri;
    var authService = {};

    authService.authentication = {
      isAuth: false,
      username: '',
    };

    authService.externalAuthData = {
      provider: '',
      username: '',
      externalAccessToken: ''
    };

    authService.registerInternalUser = function(internalRegistrationData) {
      authService.signOut();
      return $http.post(apiBaseUri + 'account/registerInternalUser', internalRegistrationData);
    };

    authService.signIn = function(signInData) {
      authService.signOut();

      var data = 
       'grant_type=password&username=' + signInData.username + 
       '&password=' + signInData.password +
       '&client_id=' + webSettings.clientId;

      var deferred = $q.defer();

      $http.post(apiBaseUri + 'token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {

        localStorageService.set('authenticationData', {
          token: response.access_token,
          username: signInData.username,
          refreshToken: response.refresh_token
        });

        authService.authentication.isAuth = true;
        authService.authentication.username = signInData.username;

        deferred.resolve(response);

      }).error(function(err) {
        authService.signOut();
        deferred.reject(err);
      });

      return deferred.promise;
    };

    authService.signOut = function() {

      localStorageService.remove('authenticationData');

      authService.authentication.isAuth = false;
      authService.authentication.username = '';
    };

    authService.fillAuthData = function() {

      var authData = localStorageService.get('authenticationData');
      if (authData) {
        authService.authentication.isAuth = true;
        authService.authentication.username = authData.username;
      }

    };

    authService.refreshToken = function() {
      var deferred = $q.defer();

      var authData = localStorageService.get('authenticationData');

      if (authData) {

        var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + webSettings.clientId;

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
          authService.signOut();
          deferred.reject(err);
        });
      } else {
        deferred.reject('No authentication data available');
      }

      return deferred.promise;
    };

    return authService;
  }
]);
