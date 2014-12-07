angular.module('webApp').directive('access', [
  'authorizationService', 'authorizationServiceConstants',
  function(authorizationService, authorizationServiceConstants) {
    'use strict';

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var makeVisible = function() {
          element.removeClass('hidden');
        };

        var makeHidden = function() {
          element.addClass('hidden');
        };

        var determineVisibility = function(resetFirst) {
          var result;
          if (resetFirst) {
            makeVisible();
          }

          result = authorizationService.authorize(true, roles, attrs.accessPermissionType);
          if (result === authorizationServiceConstants.authorizationResult.authorized) {
            makeVisible();
          }
          else {
            makeHidden();
          }
        };

        var roles = attrs.access.split(',');

        if (roles.length > 0) {
          determineVisibility(true);
        }
      }
    };
  }
]);

