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
    brandName: 'Fifthweek',
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
        data : { 
          pageTitle: fifthweekConstants.brandName 
        },
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
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'Sign In' 
        },
        views: {
          '': {
            templateUrl: 'views/signin.html',
            controller: 'SignInCtrl'
          },
          'sidebar': {
            templateUrl: 'views/partials/sidebar.html'
          }
        }
      })
      .state('register', {
        url: fifthweekConstants.registerPage,
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'Register' 
        },
        views: {
          '': {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl'
          },
          'sidebar': {
            templateUrl: 'views/partials/sidebar.html'
          }
        }
      })
      .state('account', {
        url: fifthweekConstants.accountPage,
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'My Account' 
        },
        views: {
          '': {
            templateUrl: 'views/account.html',
            controller: 'AccountCtrl'
          },
          'sidebar': {
            templateUrl: 'views/partials/sidebar.html'
          }
        },
        access: {
          loginRequired: true
        }
      })
      .state('dashboard', {
        abstract: true,
        url: 'dashboard',
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'Dashboard' 
        },
        views:{
          '': {
            templateUrl: 'views/dashboard/index.html'
          },
          'sidebar': {
            templateUrl: 'views/dashboard/partials/sidebar.html'
          }
        },
        access: {
          loginRequired: true
        }
      })
      .state('dashboard.demo', {
        url: fifthweekConstants.dashboardPage,
        templateUrl: 'views/dashboard/demonstration.html',
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'Demo' 
        },
      })
      .state('dashboard.feedback', {
        url: fifthweekConstants.feedbackPage,
        templateUrl: 'views/dashboard/feedback.html',
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'Feedback' 
        },
      })
      .state('signout', {
        url: fifthweekConstants.signOutPage,
        templateUrl: 'views/signout.html',
        controller: 'SignOutCtrl',
        data : { 
          pageTitle: fifthweekConstants.brandName + ' - ' + 'Dashboard - Sign Out' 
        },
      })
      .state('notAuthorized', {
        url: fifthweekConstants.notAuthorizedPage,
        redirectTo: fifthweekConstants.homePage  // TODO: Create a "Not Authorized" page.
      });

    snapRemoteProvider. globalOptions = {
      disable: 'right',
      touchToDrag: false
    };

})


//defined in order to use page titles globally
//see: http://stackoverflow.com/a/26086324/1257504
.run([ '$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]);
