/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').constant('authorizationServiceConstants', {
  authorizationResult: {
    authorized: 'authorized',
    loginRequired: 'loginRequired',
    notAuthorized: 'notAuthorized'
  },
  permissionCheckType: {
    atLeastOne: 'atLeastOne',
    all: 'all'
  }
}).factory('authorizationService', ['authenticationService', 'authorizationServiceConstants',
  function(authenticationService, constants) {
    'use strict';

    var service = {};

    service.authorize = function(loginRequired, requiredPermissions, permissionCheckType) {
      var result = constants.authorizationResult.authorized;
      var hasPermission = true;

      permissionCheckType = permissionCheckType || constants.permissionCheckType.atLeastOne;
      if (loginRequired === true && authenticationService.currentUser.authenticated === false) {
        result = constants.authorizationResult.loginRequired;
      }
      else if ((loginRequired === true && authenticationService.currentUser.authenticated !== false) &&
        (requiredPermissions === undefined || requiredPermissions.length === 0)) {
        // Login is required but no specific permissions are specified.
        result = constants.authorizationResult.authorized;
      }
      else if (requiredPermissions) {
        var loweredPermissions = [];

        angular.forEach(authenticationService.currentUser.permissions, function(permission) {
          loweredPermissions.push(permission.toLowerCase());
        });

        for (var i = 0; i < requiredPermissions.length; i += 1) {
          var permission = requiredPermissions[i].toLowerCase();

          if (permissionCheckType === constants.permissionCheckType.all) {
            hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
            // if all the permissions are required and hasPermission is false there is no point carrying on
            if (hasPermission === false) {
              break;
            }
          }
          else if (permissionCheckType === constants.permissionCheckType.atLeastOne) {
            hasPermission = loweredPermissions.indexOf(permission) > -1;
            // if we only need one of the permissions and we have it there is no point carrying on
            if (hasPermission) {
              break;
            }
          }
        }

        result = hasPermission ?
          constants.authorizationResult.authorized :
          constants.authorizationResult.notAuthorized;
      }

      return result;
    };

    return service;
  }
]);

