'use strict';

angular
  .module('webApp', [
    'ngResource',
    'ngRoute',
    'ui.router',
    'ngSanitize',
    'LocalStorageModule',
    'ng-focus',
    'ui.bootstrap',
    'snap',
    'monospaced.elastic',
    'angulartics',
    'angulartics.afterFirstPageTrack',
    'angulartics.google.analytics',
    'angulartics.google.analytics.userid',
    'angulartics.kissmetrics',
    'videosharing-embed',
    'angularPayments'
  ])
  .constant('fifthweekConstants', {
    apiBaseUri: window.configuredApiBaseUri,
    developerName: window.developerName,
    developerNameHeader: 'Developer-Name',
    clientId: 'fifthweek.web.1',
    unexpectedErrorText: 'An error has occurred.',
    connectionErrorText: 'Unable to communicate with the server. Make sure you are connected to the internet and try again.',
    tokenPath: 'token',
    logPath: 'log',
    longDateFormat: 'EEEE, MMMM d, yyyy',
    longDateTimeFormat: 'EEEE, MMMM d \'at\' HH:mm \'UTC\'',
    newsfeedDateFormat: 'MMM d',
    dayGroupingDateFormat: 'EEEE, MMM d'
  })
  .config(function(snapRemoteProvider) {
    snapRemoteProvider. globalOptions = {
      disable: 'right',
      touchToDrag: false
    };
  })
  .config(function ($analyticsProvider) {
    // This is true by default, for supporting sites that don't use $state or $route.
    // However, if left enabled for site that do, then a double event is fired on initial load.
    $analyticsProvider.firstPageview(false);
  });
