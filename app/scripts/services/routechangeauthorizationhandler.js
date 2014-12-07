/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('routeChangeAuthorizationHandler', ['authorizationService', 'authorizationServiceConstants', '$rootScope', '$location', 'fifthweekConstants',
  function(authorizationService, authorizationServiceConstants, $rootScope, $location, fifthweekConstants) {
    'use strict';

    var service = {};

    var routeChangeRequiredAfterLogin = false;
    var loginRedirectUrl;

    service.handleRouteChangeStart = function(next){

      if (routeChangeRequiredAfterLogin && next.originalPath !== fifthweekConstants.signInPage) {
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
          $location.path(fifthweekConstants.signInPage).replace();
        }
        else if (authorised === authorizationServiceConstants.authorizationResult.notAuthorized) {
          $location.path(fifthweekConstants.notAuthorizedPage).replace();
        }
      }
    };

    return service;
  }
]);

