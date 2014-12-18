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
  .config(function($provide){
    $provide.decorator('$exceptionHandler', function($delegate, logService) {
      return function (exception, cause) {
        $delegate(exception, cause);

        if(logService.shouldLog(exception) || logService.shouldLog(cause))
        {
          logService.log('error', {
            cause: cause,
            exception: exception
          });
        }
      };
    });
  })
  .constant('fifthweekConstants', {
    apiBaseUri: window.configuredApiBaseUri,
    clientId: 'fifthweek.web.1',
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
