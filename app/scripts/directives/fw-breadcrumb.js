angular.module('webApp').directive('fwBreadcrumb', function (navigationOrchestrator) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      intermediateStates: '=',
      current: '='
    },
    templateUrl: 'views/partials/breadcrumb.html',
    link: {
      pre: function (scope) {
        var rootNavigationItem = _.find(navigationOrchestrator.getSecondaryNavigation(), { isActive: true });
        if (!rootNavigationItem) {
          throw new FifthweekError('Could not determine active secondary page for breadcrumb');
        }

        scope.rootName = rootNavigationItem.name;
        scope.rootIcon = rootNavigationItem.icon;
        scope.rootState = rootNavigationItem.state;
      }
    }
  };
});
