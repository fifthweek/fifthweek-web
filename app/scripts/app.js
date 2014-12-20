'use strict';

angular
  .module('webApp', [
    'mgcrea.ngStrap',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',
    'ng-focus',
    'toaster',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.google.analytics.userid',
    'angulartics.kissmetrics'
  ])
  .constant('fifthweekConstants', {
    apiBaseUri: window.configuredApiBaseUri,
    clientId: 'fifthweek.web.1',
    unexpectedErrorText: 'An error has occured.',
    connectionErrorText: 'Unable to communicate with the server. Make sure you are connected to the internet and try again.',
    homePage: '/',
    signInPage: '/signin',
    signOutPage: '/signout',
    registerPage: '/register',
    accountPage: '/account',
    dashboardPage: '/dashboard',
    feedbackPage: '/dashboard/feedback',
    notAuthorizedPage: '/notauthorized'
  })
  .config(['$routeProvider', 'fifthweekConstants',
    function ($routeProvider, fifthweekConstants) {
    $routeProvider
      .when(fifthweekConstants.homePage, {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when(fifthweekConstants.signInPage, {
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl'
      })
      .when(fifthweekConstants.registerPage, {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when(fifthweekConstants.accountPage, {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        access: {
          loginRequired: true
        }
      })
      .when(fifthweekConstants.dashboardPage, {
        templateUrl: 'views/dashboard/demonstration.html',
        access: {
          loginRequired: true
        }
      })
      .when(fifthweekConstants.feedbackPage, {
        templateUrl: 'views/dashboard/feedback.html',
        access: {
          loginRequired: true
        }
      })
      .when(fifthweekConstants.signOutPage, {
        templateUrl: 'views/signout.html',
        controller: 'SignOutCtrl'
      })
      .when(fifthweekConstants.notAuthorizedPage, {
        redirectTo: fifthweekConstants.homePage  // TODO: Create a "Not Authorized" page.
      })
      .otherwise({
        redirectTo: fifthweekConstants.homePage
      });
  }]);
