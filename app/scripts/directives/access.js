angular.module('webApp').directive('access', [
  'authService',
  function(authService) {
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

          result = authService.authorize(true, roles, attrs.accessPermissionType);
          if (result === authService.enums.authorizationResult.authorized) {
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

