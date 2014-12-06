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
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',
    'toaster',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/help', {
        templateUrl: 'views/dashboard.html',
        controller: 'HelpCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/signout', {
        templateUrl: 'views/signout.html',
        controller: 'SignOutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('webSettings', {
    apiBaseUri: 'https://10.211.55.3:44301/',
    clientId: 'fifthweek.web.1',
    successfulSignInPath: '/dashboard',
    successfulSignOutPath: '/signin'
  });
