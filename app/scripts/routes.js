'use strict';

angular.module('routes', ['ui.router'])
  .constant('uiRouterConstants', {
    stateChangeStartEvent: '$stateChangeStart',
    stateChangeSuccessEvent: '$stateChangeSuccess'
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
  })
  .config(function($stateProvider, $urlRouterProvider, states) {

    //for any unmatched url, redirect to home page
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state(states.home.name, {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        data: {
          pageTitle: 'Home',
          disableSidebar: true,
          bodyClass: 'page-home'
        }
      })
      .state(states.signIn.name, {
        url: '/signin',
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl',
        data : {
          pageTitle: 'Sign In',
          headTitle: ' - ' + 'Sign In'
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
      .state(states.account.name, {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        data : {
          pageTitle: 'My Account',
          headTitle: ' - ' + 'My Account',
          access: {
            loginRequired: true
          }
        }
      })
      .state(states.dashboard.name, {
        abstract: false,
        url: '/dashboard',
        templateUrl: 'views/dashboard/index.html',
        redirectTo: states.dashboard.demo.name,
        data : {
          pageTitle: 'Dashboard',
          headTitle: ' - ' + 'Dashboard',
          access: {
            loginRequired: true
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
        templateUrl: 'views/creators/index.html',
        redirectTo: states.creators.landingPage.name,
        data : {
          pageTitle: 'Creators',
          headTitle: ' - ' + 'Creators',
          access: {
            loginRequired: true
          }
        }
      })
      .state(states.creators.landingPage.name, {
        url: '/landing-page',
        templateUrl: 'views/creators/landing-page.html',
        controller: 'landingPageCtrl',
        data : {
          pageTitle: 'Landing page',
          headTitle: ' - ' + 'Landing page',
          disableSidebar: true,
          bodyClass: 'page-landing',
          access: {
            loginRequired: false // Disable the inherited access requirement.
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
        templateUrl: 'views/creators/customize/index.html',
        data : {
          pageTitle: 'Customize',
          headTitle: ' - ' + 'Customize'
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
        templateUrl: 'views/help/index.html',
        redirectTo: states.help.faq.name,
        data : {
          pageTitle: 'Help',
          headTitle: ' - ' + 'Help'
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
        templateUrl: 'views/not-authorized/not-authorized.html',
        data : {
          pageTitle: 'Not Authorized',
          headTitle: ' - ' + 'Not Authorized'
        }
      });
});
