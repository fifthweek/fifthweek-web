// Dummy mock for running Karma and still allowing app to find Angulartics modules

angular.module('angulartics', []).provider('$analytics', function () {

  // Dummy mock aspects used in app.js configuration.
  return {
    $get: function() {},
    firstPageview: function() {}
  };
});
angular.module('angulartics.kissmetrics', []);
angular.module('angulartics.google.analytics', []);
angular.module('angulartics.google.analytics.userid', []);
angular.module('angulartics.afterFirstPageTrack', []);
