angular.module('webApp').directive('roles', [
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

          result = authorizationService.authorize(true, roles, attrs.roleCheckType);
          if (result === authorizationServiceConstants.authorizationResult.authorized) {
            makeVisible();
          }
          else {
            makeHidden();
          }
        };

        var roles = attrs.roles.split(/[\s,]+/);

        if (roles.length > 0) {
          determineVisibility(true);
        }
      }
    };
  }
]);

