/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('authenticationService', ['$http', '$q', 'localStorageService', 'webSettings',
  function($http, $q, localStorageService, webSettings) {
    'use strict';

    var apiBaseUri = webSettings.apiBaseUri;
    var service = {};

    service.currentUser = {
      authenticated: false,
      username: '',
      permissions: []
    };

    service.registerUser = function(internalRegistrationData) {
      service.signOut();
      return $http.post(apiBaseUri + 'account/registerUser', internalRegistrationData);
    };

    service.signIn = function(signInData) {
      service.signOut();

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

        service.currentUser.authenticated = true;
        service.currentUser.username = signInData.username;

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

    service.fillAuthData = function() {

      var authData = localStorageService.get('authenticationData');
      if (authData) {
        service.currentUser.authenticated = true;
        service.currentUser.username = authData.username;
      }

    };

    service.refreshToken = function() {
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
          service.signOut();
          deferred.reject(err);
        });
      }
      else {
        deferred.reject('No authentication data available');
      }

      return deferred.promise;
    };

    return service;
  }
]);

