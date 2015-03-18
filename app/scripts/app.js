'use strict';

angular
  .module('webApp', [
    'mgcrea.ngStrap',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ui.router',
    'routes',
    'ngSanitize',
    'LocalStorageModule',
    'ng-focus',
    'ui.bootstrap',
    'snap',
    'monospaced.elastic',
    'ui.sortable',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.google.analytics.userid',
    'angulartics.kissmetrics',
    'videosharing-embed',
    'yaru22.md'
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
    newsfeedDateFormat: 'MMM d'
  })
  .config(function(snapRemoteProvider) {
    snapRemoteProvider. globalOptions = {
      disable: 'right',
      touchToDrag: false
    };
  });
