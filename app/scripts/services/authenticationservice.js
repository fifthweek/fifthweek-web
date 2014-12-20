/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('authenticationService',
  function($http, $q, $analytics, localStorageService, fifthweekConstants, utilities) {
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
    return $http.post(apiBaseUri + 'membership/registrations', internalRegistrationData).catch(function(response){
      return $q.reject(utilities.getHttpError(response));
    });
  };

  service.signIn = function(signInData) {
    service.signOut();

    var data =
      'grant_type=password&username=' + signInData.username +
      '&password=' + signInData.password +
      '&client_id=' + fifthweekConstants.clientId;

    return $http.post(apiBaseUri + 'token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {

      // Performed server-side. Repeated here to make UI consistent with API rules.
      var normalizedUsername = normalizeUsername(signInData.username);

      localStorageService.set('authenticationData', {
        token: response.data.access_token,
        username: normalizedUsername,
        refreshToken: response.data.refresh_token
      });

      service.currentUser.authenticated = true;
      service.currentUser.username = normalizedUsername;

      $analytics.setUsername(response.data.user_id);
    }, function(response){
      return $q.reject(utilities.getHttpError(response));
    });
  };

  service.signOut = function() {
    localStorageService.remove('authenticationData');
    service.currentUser.authenticated = false;
    service.currentUser.username = '';
    service.currentUser.permissions = [];
  };

  service.refreshToken = function() {
    var authData = localStorageService.get('authenticationData');

    if (!authData) {
      return $q.reject(new FifthweekError('No local authentication data available.'));
    }
    var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + fifthweekConstants.clientId;

    return $http.post(apiBaseUri + 'token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {

      localStorageService.set('authenticationData', {
        token: response.data.access_token,
        username: response.data.username,
        refreshToken: response.data.refresh_token
      });

    }, function(response) {
      return $q.reject(utilities.getHttpError(response));
    }).catch(function(error){
      service.signOut();
      return $q.reject(error);
    });
  };

  var normalizeUsername = function(username) {
    return username.trim().toLowerCase();
  };

  return service;
});

