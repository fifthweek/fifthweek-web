(function(angular) {
  'use strict';

  angular.module('angulartics.google.analytics.userid', ['angulartics'])
    .config(['$analyticsProvider', function ($analyticsProvider) {

      $analyticsProvider.registerSetUsername(function (uuid) {
        window.ga('set', '&uid', uuid);
      });
    }]);

})(angular);
