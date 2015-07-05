(function(angular) {
  'use strict';

  angular.module('angulartics.afterFirstPageTrack', ['angulartics'])
    .config(['$analyticsProvider', function ($analyticsProvider) {

      var isFirstPageTrack = true;

      $analyticsProvider.registerPageTrack(function () {

        // Some querystring parameters should be removed on-load. However, they must be
        // tracked to the analytics provides first. The following code ensures we only
        // strip these querystring parameters once they have been included in the 'path'
        // string that gets propagated to all analytics providers.
        if (isFirstPageTrack) {
          isFirstPageTrack = false;

          // Possibly a better way to do this...
          var injector = angular.element(document.body).injector();
          var $location = injector.get('$location');

          var parameters = $location.search();
          var parametersToRemove = [
            'emailed_to',
            'utm_campaign',
            'utm_source',
            'utm_medium',
            'utm_content'
          ];

          _.forEach(parametersToRemove, function(parameterToRemove) {
            if (parameters[parameterToRemove]) {
              $location.search(parameterToRemove, null);
            }
          });
        }
      });
    }]);

})(angular);
