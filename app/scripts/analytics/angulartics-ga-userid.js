(function(angular) {
  'use strict';

  angular.module('angulartics.google.analytics.userid', ['angulartics'])
    .config(['$analyticsProvider', function ($analyticsProvider) {

      $analyticsProvider.registerSetUsername(function (uuid) {
        ga('set', '&uid', uuid);
      });
    }]);

})(angular);
