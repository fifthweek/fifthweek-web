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
    'toaster'
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
      .when('/orders', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/refresh', {
        templateUrl: 'views/refresh.html',
        controller: 'RefreshCtrl'
      })
      .when('/tokens', {
        templateUrl: 'views/tokens.html',
        controller: 'TokensManagerCtrl'
      })
      .when('/associate', {
        templateUrl: 'views/associate.html',
        controller: 'AssociateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('webSettings', {
    apiBaseUri: 'http://fifthweek-api.azurewebsites.net/',
    clientId: 'fifthweek.web.1',
    successfulSignInPath: '/orders'
  });