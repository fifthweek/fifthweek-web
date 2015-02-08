/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').constant('authorizationServiceConstants', {
  authorizationResult: {
    authorized: 'authorized',
    loginRequired: 'loginRequired',
    notAuthorized: 'notAuthorized'
  },
  fwRoleCheckType: {
    atLeastOne: 'atLeastOne',
    all: 'all'
  }
}).factory('authorizationService', ['authenticationService', 'authorizationServiceConstants',
  function(authenticationService, constants) {
    'use strict';

    var service = {};

    service.authorize = function(loginRequired, requiredRoles, roleCheckType) {
      var result = constants.authorizationResult.authorized;
      var hasRole = true;

      roleCheckType = roleCheckType || constants.fwRoleCheckType.atLeastOne;
      if (loginRequired === true && authenticationService.currentUser.authenticated === false) {
        result = constants.authorizationResult.loginRequired;
      }
      else if ((loginRequired === true && authenticationService.currentUser.authenticated !== false) &&
        (requiredRoles === undefined || requiredRoles.length === 0)) {
        // Login is required but no specific roles are specified.
        result = constants.authorizationResult.authorized;
      }
      else if (requiredRoles) {
        var loweredRoles = [];

        angular.forEach(authenticationService.currentUser.roles, function(role) {
          loweredRoles.push(role.toLowerCase());
        });

        for (var i = 0; i < requiredRoles.length; i += 1) {
          var role = requiredRoles[i].toLowerCase();

          if (roleCheckType === constants.fwRoleCheckType.all) {
            hasRole = hasRole && loweredRoles.indexOf(role) > -1;
            // if all the roles are required and hasRole is false there is no point carrying on
            if (hasRole === false) {
              break;
            }
          }
          else if (roleCheckType === constants.fwRoleCheckType.atLeastOne) {
            hasRole = loweredRoles.indexOf(role) > -1;
            // if we only need one of the roles and we have it there is no point carrying on
            if (hasRole) {
              break;
            }
          }
        }

        result = hasRole ?
          constants.authorizationResult.authorized :
          constants.authorizationResult.notAuthorized;
      }

      return result;
    };

    return service;
  }
]);
