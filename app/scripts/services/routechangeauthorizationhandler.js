/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('routeChangeAuthorizationHandler', ['authorizationService', 'authorizationServiceConstants', '$rootScope', '$location', 'webSettings',
  function(authorizationService, authorizationServiceConstants, $rootScope, $location, webSettings) {
    'use strict';

    var service = {};

    var routeChangeRequiredAfterLogin = false;
    var loginRedirectUrl;

    service.handleRouteChangeStart = function(next){

      if (routeChangeRequiredAfterLogin && next.originalPath !== webSettings.signInPage) {
        routeChangeRequiredAfterLogin = false;
        $location.path(loginRedirectUrl).replace();
      }
      else if (next.access !== undefined) {
        var authorised = authorizationService.authorize(
          next.access.loginRequired,
          next.access.permissions,
          next.access.permissionCheckType);

        if (authorised === authorizationServiceConstants.authorizationResult.loginRequired) {
          routeChangeRequiredAfterLogin = true;
          loginRedirectUrl = next.originalPath;
          $location.path(webSettings.signInPage).replace();
        }
        else if (authorised === authorizationServiceConstants.authorizationResult.notAuthorized) {
          $location.path(webSettings.notAuthorizedPage).replace();
        }
      }
    };

    return service;
  }
]);

