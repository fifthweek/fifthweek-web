'use strict';

angular
  .module('webApp', [
    'mgcrea.ngStrap',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ui.router',
    'ngSanitize',
    'LocalStorageModule',
    'ng-focus',
    'toaster',
    'angular-loading-bar',
    'snap',
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
    unexpectedErrorText: 'An error has occured.',
    connectionErrorText: 'Unable to communicate with the server. Make sure you are connected to the internet and try again.',
    tokenPath: 'token',
    logPath: 'log',
    homePage: '/',
    signInPage: '/signin',
    signOutPage: '/signout',
    registerPage: '/register',
    accountPage: '/account',
    dashboardPage: '^/dashboard/demo',
    feedbackPage: '^/dashboard/feedback',
    notAuthorizedPage: '/notauthorized'
  })

  .config(function($stateProvider, $urlRouterProvider, fifthweekConstants, snapRemoteProvider) {

    //for any unmatched url, redirect to home page
    $urlRouterProvider.otherwise(fifthweekConstants.homePage);

    $stateProvider

      .state('home', {
        url: fifthweekConstants.homePage,
        templateUrl: 'views/home.html',
        views: {
          '': {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
          },
          'sidebar': {
            templateUrl: 'views/partials/sidebar.html'
          }
        },
      })
      .state('signin', {
        url: fifthweekConstants.signInPage,
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl'
      })
      .state('register', {
        url: fifthweekConstants.registerPage,
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .state('account', {
        url: fifthweekConstants.accountPage,
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        access: {
          loginRequired: true
        }
      })
      .state('dashboard', {
        abstract: true,
        url: 'dashboard',
        views:{
          '': {
            templateUrl: 'views/dashboard/index.html'
          },
          'sidebar': {
            templateUrl: 'views/dashboard/partials/sidebar.html'
          }
        }
      })
      .state('dashboard.demo', {
        url: fifthweekConstants.dashboardPage,
        templateUrl: 'views/dashboard/demonstration.html'
      })
      .state('dashboard.feedback', {
        url: fifthweekConstants.feedbackPage,
        templateUrl: 'views/dashboard/feedback.html'
      })
      .state('signout', {
        url: fifthweekConstants.signOutPage,
        templateUrl: 'views/signout.html',
        controller: 'SignOutCtrl'
      })
      .state('notAuthorized', {
        url: fifthweekConstants.notAuthorizedPage,
        redirectTo: fifthweekConstants.homePage  // TODO: Create a "Not Authorized" page.
      });

    /*
    .state('state1', {
      url: '/state1',
      templateUrl: 'views/state1.html'
    })
    .state('state1.list', {
      url: '/list1',
      templateUrl: 'views/state1.list.html',
      controller: function($scope) {
        $scope.items = ['A', 'List', 'Of', 'Items'];
      }
    })
    .state('state2', {
      url: '/state2',
      templateUrl: 'views/state2.html'
    })
    .state('state2.list', {
      url: '/list2',
      templateUrl: 'views/state2.list.html',
      controller: function($scope) {
        $scope.things = ['A', 'Set', 'Of', 'Things'];
      }
    });
});
    */

    snapRemoteProvider. globalOptions = {
      disable: 'right',
      touchToDrag: false
    };

});

