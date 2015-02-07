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
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.google.analytics.userid',
    'angulartics.kissmetrics'
  ])
  .constant('fifthweekConstants', {
    apiBaseUri: window.configuredApiBaseUri,
    developerName: window.developerName,
    developerNameHeader: 'Developer-Name',
    clientId: 'fifthweek.web.1',
    unexpectedErrorText: 'An error has occurred.',
    connectionErrorText: 'Unable to communicate with the server. Make sure you are connected to the internet and try again.',
    tokenPath: 'token',
    logPath: 'log'
  })
  
.config(function(snapRemoteProvider) {

  snapRemoteProvider. globalOptions = {
    disable: 'right',
    touchToDrag: false
  };

})
.run(function ($rootScope, $state, $stateParams) {
  //global page titles
  //see: http://stackoverflow.com/a/26086324/1257504
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});
