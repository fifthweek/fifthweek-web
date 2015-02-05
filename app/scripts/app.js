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
  .constant('states', {
    home: {
      name: 'home'
    },
    signIn: {
      name: 'signIn'
    },
    signOut: {
      name: 'signOut'
    },
    register: {
      name: 'register'
    },
    account: {
      name: 'account'
    },
    dashboard: {
      name: 'dashboard',
      demo: {
        name: 'dashboard.demo'
      },
      feedback: {
        name: 'dashboard.feedback'
      }
    },
    creators: {
      name: 'creators',
      landingPage: {
        name: 'creators.landingPage'
      },
      createSubscription: {
        name: 'creators.createSubscription'
      },
      customize: {
        name: 'creators.customize',
        landingPage: {
          name: 'creators.customize.landingPage'
        },
        collections: {
          name: 'creators.customize.collections'
        },
        channels: {
          name: 'creators.customize.channels'
        }
      }
    },
    help: {
      name: 'help',
      faq: {
        name: 'help.faq'
      }
    },
    notAuthorized: {
      name: 'notAuthorized'
    }
  }
)
.config(function($stateProvider, $urlRouterProvider, snapRemoteProvider, states) {

  //for any unmatched url, redirect to home page
  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state(states.home.name, {
      url: '/',
      templateUrl: 'views/home.html',
      data: {
        pageTitle: 'Home',
        disableSidebar: true
      },
      views: {
        '': {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state(states.signIn.name, {
      url: '/signin',
      data : {
        pageTitle: 'Sign In',
        headTitle: ' - ' + 'Sign In'
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
    .state(states.signOut.name, {
      url: '/signout',
      templateUrl: 'views/signout.html',
      controller: 'SignOutCtrl',
      data : {
        pageTitle: 'Sign Out',
        headTitle: ' - ' + 'Sign Out'
      }
    })
    .state(states.register.name, {
      url: '/register',
      data : {
        pageTitle: 'Register',
        headTitle: ' - ' + 'Register'
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
    .state(states.account.name, {
      url: '/account',
      data : {
        pageTitle: 'My Account',
        headTitle: ' - ' + 'My Account',
        access: {
          loginRequired: true
        }
      },
      views: {
        '': {
          templateUrl: 'views/account.html',
          controller: 'AccountCtrl'
        },
        'sidebar': {
          templateUrl: 'views/partials/sidebar.html'
        }
      }
    })
    .state(states.dashboard.name, {
      abstract: false,
      url: '/dashboard',
      redirectTo: states.dashboard.demo.name,
      data : {
        pageTitle: 'Dashboard',
        headTitle: ' - ' + 'Dashboard',
        access: {
          loginRequired: true
        }
      },
      views:{
        '': {
          templateUrl: 'views/dashboard/index.html'
        },
        'sidebar': {
          templateUrl: 'views/partials/sidebar.html'
        }
      }
    })
    .state(states.dashboard.demo.name, {
      url: '/demo',
      templateUrl: 'views/dashboard/demo.html',
      data : {
        pageTitle: 'Quick Demo',
        headTitle: ' - ' + 'Demo'
      }
    })
    .state(states.dashboard.feedback.name, {
      url: '/feedback',
      templateUrl: 'views/dashboard/feedback.html',
      data : {
        pageTitle: 'Provide Feedback',
        headTitle: ' - ' + 'Feedback'
      }
    })
    .state(states.creators.name, {
      abstract: false,
      url: '/creators',
      redirectTo: states.creators.landingPage.name,
      data : {
        pageTitle: 'Creators',
        headTitle: ' - ' + 'Creators',
        access: {
          loginRequired: true
        }
      },
      views:{
        '': {
          templateUrl: 'views/creators/index.html'
        },
        'sidebar': {
          templateUrl: 'views/partials/sidebar.html'
        }
      }
    })
    .state(states.creators.landingPage.name, {
      url: '/landing-page',
      data : {
        pageTitle: 'Landing page',
        headTitle: ' - ' + 'Landing page',
        disableSidebar: true,
        access: {
          loginRequired: false // Disable the inherited access requirement.
        }
      },
      views: {
        '': {
          templateUrl: 'views/creators/landing-page.html',
          controller: 'landingPageCtrl'
        }
      }
    })
    .state(states.creators.createSubscription.name, {
      url: '/create-subscription',
      templateUrl: 'views/creators/create-subscription.html',
      controller: 'createSubscriptionCtrl',
      data : {
        pageTitle: 'Create Your Subscription',
        headTitle: ' -' + ' Create Your Subscription'
      }
    })
    .state(states.creators.customize.name, {
      url: '/customize',
      data : {
        pageTitle: 'Customize',
        headTitle: ' - ' + 'Customize'
      },
      views:{
        '': {
          templateUrl: 'views/creators/customize/index.html'
        }
      }
    })
    .state(states.creators.customize.landingPage.name, {
      url: '/landing-page',
      templateUrl: 'views/creators/customize/landingpage.html',
      controller: 'customizeLandingPageCtrl',
      data : {
        pageTitle: ' Landing page',
        headTitle: ' -' + ' Landing page'
      }
    })
    .state(states.creators.customize.collections.name, {
      url: '/collections',
      templateUrl: 'views/creators/customize/collections.html',
      data : {
        pageTitle: 'Collections',
        headTitle: ' - ' + 'Collections'
      }
    })
    .state(states.creators.customize.channels.name, {
      url: '/channels',
      templateUrl: 'views/creators/customize/channels.html',
      data : {
        pageTitle: 'Channels',
        headTitle: ' - ' + 'Channels'
      }
    })
    .state(states.help.name, {
      abstract: false,
      url: '/help',
      redirectTo: states.help.faq.name,
      data : {
        pageTitle: 'Help',
        headTitle: ' - ' + 'Help'
      },
      views:{
        '': {
          templateUrl: 'views/help/index.html'
        },
        'sidebar': {
          templateUrl: 'views/partials/sidebar.html'
        }
      }
    })
    .state(states.help.faq.name, {
      url: '/faq',
      templateUrl: 'views/help/faq.html',
      data : {
        pageTitle: 'Frequently Asked Questions',
        headTitle: ' - ' + 'Frequently Asked Questions'
      }
    })
    .state(states.notAuthorized.name, {
      url: '/not-authorized',
      data : {
        pageTitle: 'Not Authorized',
        headTitle: ' - ' + 'Not Authorized'
      },
      views: {
        '': {
          templateUrl: 'views/not-authorized/not-authorized.html'
        },
        'sidebar': {
          templateUrl: 'views/partials/sidebar.html'
        }
      }
    });

  snapRemoteProvider. globalOptions = {
    disable: 'right',
    touchToDrag: false
  };
})

//global page titles
//see: http://stackoverflow.com/a/26086324/1257504
.run([ '$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]);
