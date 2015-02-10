/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .constant('authenticationServiceConstants', {
    currentUserChangedEvent: 'currentUserChanged',
    roles: {
      creator: 'creator',
      administrator: 'administrator',
      psychic: 'psychic'
    }
  })
  .factory('authenticationService', function(authenticationServiceImpl){
    authenticationServiceImpl.initialize();
    return authenticationServiceImpl;
  })
  .factory('authenticationServiceImpl',
  function(
    $http,
    $q,
    $rootScope,
    analytics,
    localStorageService,
    aggregateUserStateService,
    fifthweekConstants,
    authenticationServiceConstants,
    utilities) {
    'use strict';

    var apiBaseUri = fifthweekConstants.apiBaseUri;
    var service = {};

    var localStorageName = 'currentUser';

    service.currentUser = {};

    var broadcastCurrentUserChangedEvent = function(){
      $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, service.currentUser);
    };

    var clearCurrentUserDetails = function(){
      service.currentUser.authenticated = false;
      service.currentUser.accessToken = undefined;
      service.currentUser.refreshToken = undefined;
      service.currentUser.userId = undefined;
      service.currentUser.username = undefined;
      service.currentUser.roles = undefined;

      localStorageService.remove(localStorageName);
      broadcastCurrentUserChangedEvent();
    };

    var setCurrentUserDetails = function(accessToken, refreshToken, userId, username, roles){
      service.currentUser.authenticated = true;
      service.currentUser.accessToken = accessToken;
      service.currentUser.refreshToken = refreshToken;
      service.currentUser.userId = userId;
      service.currentUser.username = username;
      service.currentUser.roles = roles;

      localStorageService.set(localStorageName, service.currentUser);
      broadcastCurrentUserChangedEvent();
    };

    service.initialize = function() {
      var storedUser = localStorageService.get(localStorageName);
      if (storedUser) {
        service.currentUser = storedUser;
        broadcastCurrentUserChangedEvent();
      } else {
        clearCurrentUserDetails();
      }
    };

    service.registerUser = function(internalRegistrationData) {
      service.signOut();
      return $http.post(apiBaseUri + 'membership/registrations', internalRegistrationData).catch(function(response){
        return $q.reject(utilities.getHttpError(response));
      });
    };

    service.signIn = function(signInData) {
      var body =
        'grant_type=password&username=' + signInData.username +
        '&password=' + signInData.password +
        '&client_id=' + fifthweekConstants.clientId;

      var headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      return service.signOut()
        .then(function() {
          return $http.post(apiBaseUri + 'token', body, headers).catch(function(response){
            return $q.reject(utilities.getHttpError(response));
          });
        })
        .then(function(response) {
          return extractAuthenticationDataFromResponse(response);
        })
        .then(function(){
          analytics.setUsername(service.currentUser.userId);
        })
        .then(function() {
          return aggregateUserStateService.synchronizeWithServer(service.currentUser.userId);
        });
    };

    service.refreshToken = function() {

      if (!service.currentUser.authenticated) {
        return $q.reject(new FifthweekError('Cannot refresh the authentication token because the user is not authenticated.'));
      }

      var data = 'grant_type=refresh_token&refresh_token=' + service.currentUser.refreshToken +
        '&client_id=' + fifthweekConstants.clientId;

      return $http.post(apiBaseUri + 'token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(response) {
        return extractAuthenticationDataFromResponse(response);
      }, function(response) {
        return $q.reject(utilities.getHttpError(response));
      }).catch(function(error){
        service.signOut();
        return $q.reject(error);
      });
    };

    service.signOut = function() {
      clearCurrentUserDetails();

      return aggregateUserStateService.synchronizeWithServer();
    };

    var extractAuthenticationDataFromResponse = function (response){
      return $q(function(resolve, reject) {
        var username = response.data.username;
        if (!username ){
          return reject(new FifthweekError('The username was not returned'));
        }

        var roles = [];
        var rolesString = response.data.roles;
        if (rolesString)
        {
          roles = response.data.roles.split(',');
        }

        var userId = response.data.user_id;
        if (!userId){
          return reject(new FifthweekError('The user ID was not returned'));
        }

        var accessToken = response.data.access_token;
        if (!accessToken)
        {
          return reject(new FifthweekError('The access token was not returned'));
        }

        var refreshToken = response.data.refresh_token;
        if (!refreshToken)
        {
          return reject(new FifthweekError('The refresh token was not returned'));
        }

        setCurrentUserDetails(accessToken, refreshToken, userId, username, roles);
        return resolve();
      });
    };

    return service;
});

