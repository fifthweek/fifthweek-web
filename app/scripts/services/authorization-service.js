/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').constant('authorizationServiceConstants', {
  authorizationResult: {
    authorized: 'authorized',
    loginRequired: 'loginRequired',
    notAuthorized: 'notAuthorized'
  },
  roleCheckType: {
    atLeastOne: 'atLeastOne',
    all: 'all',
    none: 'none'
  }
}).factory('authorizationService', ['authenticationService', 'authorizationServiceConstants',
  function(authenticationService, constants) {
    'use strict';

    var service = {};

    service.authorize = function(loginRequired, requiredRoles, roleCheckType) {
      var result = constants.authorizationResult.authorized;

      roleCheckType = roleCheckType || constants.roleCheckType.atLeastOne;
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

        var hasRole = true;

        for (var i = 0; i < requiredRoles.length; i += 1) {
          var role = requiredRoles[i].toLowerCase();

          if (roleCheckType === constants.roleCheckType.all) {
            hasRole = hasRole && loweredRoles.indexOf(role) > -1;
            // if all of the roles are required and hasRole is false there is no point carrying on
            if (hasRole === false) {
              break;
            }
          }
          else if (roleCheckType === constants.roleCheckType.atLeastOne || roleCheckType === constants.roleCheckType.none) {
            hasRole = loweredRoles.indexOf(role) > -1;
            // if we only need one of the roles, or we should have any, and we have it there is no point carrying on
            if (hasRole) {
              break;
            }
          }
        }

        if(roleCheckType === constants.roleCheckType.none){
          result = hasRole ?
            constants.authorizationResult.notAuthorized :
            constants.authorizationResult.authorized;
        }
        else{
          result = hasRole ?
            constants.authorizationResult.authorized :
            constants.authorizationResult.notAuthorized;
        }
      }

      return result;
    };

    return service;
  }
]);

