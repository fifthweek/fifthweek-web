angular.module('webApp').directive('fwBreadcrumb', function (navigationOrchestrator) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      intermediateStates: '&',
      current: '@',
      // Convenience bindings for creating intermediate states:
      previous: '@',
      previousState: '&'
    },
    templateUrl: 'views/partials/breadcrumb.html',
    link: {
      pre: function (scope, element, attrs) {
        var rootNavigationItem = _.find(navigationOrchestrator.getSecondaryNavigation(), { isActive: true });
        if (!rootNavigationItem) {
          throw new FifthweekError('Could not determine active secondary page for breadcrumb');
        }

        scope.rootName = rootNavigationItem.name;
        scope.rootIcon = rootNavigationItem.icon;
        scope.rootState = rootNavigationItem.state;

        if (attrs.previous && attrs.previousState) {
          scope.intermediateStates = [
            {
              name: scope.previous,
              click: scope.previousState
            }
          ];
        }
        else {
          // Evaluate states once.
          scope.intermediateStates = scope.intermediateStates();
        }
      }
    }
  };
});
