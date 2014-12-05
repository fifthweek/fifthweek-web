/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('authService', ['$http', '$q', 'localStorageService', 'webSettings',
  function($http, $q, localStorageService, webSettings) {
    'use strict';

    var apiBaseUri = webSettings.apiBaseUri;
    var authService = {};

    authService.enums = {
      authorizationResult: {
        authorized: 'authorized',
        loginRequired: 'loginRequired',
        notAuthorized: 'notAuthorized'
      },
      permissionCheckType: {
        atLeastOne: 'atLeastOne',
        all: 'all'
      }
    };

    authService.authentication = {
      isAuth: false,
      username: '',
      permissions: []
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
      }
      else {
        deferred.reject('No authentication data available');
      }

      return deferred.promise;
    };

    authService.authorize = function(loginRequired, requiredPermissions, permissionCheckType) {
      var result = authService.enums.authorizationResult.authorized;
      var hasPermission = true;

      permissionCheckType = permissionCheckType || authService.enums.permissionCheckType.atLeastOne;
      if (loginRequired === true && authService.authentication.isAuth === false) {
        result = authService.enums.authorizationResult.loginRequired;
      }
      else if ((loginRequired === true && authService.authentication.isAuth !== false) &&
        (requiredPermissions === undefined || requiredPermissions.length === 0)) {
        // Login is required but no specific permissions are specified.
        result = authService.enums.authorizationResult.authorized;
      }
      else if (requiredPermissions) {
        var loweredPermissions = [];

        angular.forEach(authService.authentication.permissions, function(permission) {
          loweredPermissions.push(permission.toLowerCase());
        });

        for (var i = 0; i < requiredPermissions.length; i += 1) {
          var permission = requiredPermissions[i].toLowerCase();

          if (permissionCheckType === authService.enums.permissionCheckType.all) {
            hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
            // if all the permissions are required and hasPermission is false there is no point carrying on
            if (hasPermission === false) {
              break;
            }
          }
          else if (permissionCheckType === authService.enums.permissionCheckType.atLeastOne) {
            hasPermission = loweredPermissions.indexOf(permission) > -1;
            // if we only need one of the permissions and we have it there is no point carrying on
            if (hasPermission) {
              break;
            }
          }
        }

      result = hasPermission ?
        authService.enums.authorizationResult.authorized :
        authService.enums.authorizationResult.notAuthorized;
    }

      return result;
    };

    return authService;
  }
]);

