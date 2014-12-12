'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'mgcrea.ngStrap',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',
    'toaster',
    'angular-loading-bar'
  ])
  .constant('fifthweekConstants', {
    apiBaseUri: 'https://10.211.55.3:44301/',
    clientId: 'fifthweek.web.1',
    homePage: '/',
    signInPage: '/signin',
    signOutPage: '/signout',
    registerPage: '/register',
    accountPage: '/account',
    dashboardPage: '/dashboard',
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
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
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
