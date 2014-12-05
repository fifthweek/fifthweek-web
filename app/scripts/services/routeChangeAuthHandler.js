/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('routeChangeAuthHandler', ['authService', '$rootScope', '$location',
  function(authService, $rootScope, $location) {
    'use strict';

    var service = {};

    var routeChangeRequiredAfterLogin = false;
    var loginRedirectUrl;

    service.handleRouteChangeStart = function(next){

      if (routeChangeRequiredAfterLogin && next.originalPath !== '/signin') {
        routeChangeRequiredAfterLogin = false;
        $location.path(loginRedirectUrl).replace();
      }
      else if (next.access !== undefined) {
        var authorised = authService.authorize(
          next.access.loginRequired,
          next.access.permissions,
          next.access.permissionCheckType);

        if (authorised === authService.enums.authorizationResult.loginRequired) {
          routeChangeRequiredAfterLogin = true;
          loginRedirectUrl = next.originalPath;
          $location.path('/signin').replace();
        }
        else if (authorised === authService.enums.authorizationResult.notAuthorized) {
          $location.path('/notauthorised').replace();
        }
      }
    };

    return service;
  }
]);

