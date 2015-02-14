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
      name: 'signIn',
      signIn: {
        name: 'signIn.signIn'
      },
      forgot: {
        name: 'signIn.forgot'
      },
      reset: {
        name: 'signIn.reset'
      }
    },
    signOut: {
      name: 'signOut'
    },
    account: {
      name: 'account'
    },
    creators: {
      name: 'creators',
      landingPage: {
        name: 'creators.landingPage'
      },
      createSubscription: {
        name: 'creators.createSubscription'
      },
      compose: {
        name: 'creators.compose',
        note: {
          name: 'creators.compose.note'
        },
        image: {
          name: 'creators.compose.image'
        },
        file: {
          name: 'creators.compose.file'
        }
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
      },
      contact: {
        name: 'help.contact'
      },
      legal: {
        name: 'help.legal',
        termsOfService: {
          name: 'help.legal.termsOfService'
        },
        privacyPolicy: {
          name: 'help.legal.privacyPolicy'
        }
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
          bodyClass: 'page-home',
          access: {
            requireUnauthenticated: true
          }
        }
      })
      .state(states.signIn.name, {
        url: '/sign-in',
        templateUrl: 'views/sign-in/index.html',
        redirectTo: states.signIn.signIn.name,
        data : {
          access: {
            requireUnauthenticated: true
          }
        }
      })
      .state(states.signIn.signIn.name, {
        url: '',
        templateUrl: 'views/sign-in/sign-in.html',
        controller: 'SignInCtrl',
        data : {
          pageTitle: 'Sign In',
          headTitle: ': ' + 'Sign In',
          access: {
            requireUnauthenticated: true
          }
        }
      })
      .state(states.signIn.forgot.name, {
        url: '/forgot',
        templateUrl: 'views/sign-in/forgot.html',
        controller: 'SignInForgotCtrl',
        data : {
          pageTitle: 'Forgot Your Details?',
          headTitle: ': ' + 'Forgot Details?',
          access: {
            requireUnauthenticated: true
          }
        }
      })
      .state(states.signIn.reset.name, {
        url: '/reset?userId&token',
        templateUrl: 'views/sign-in/reset.html',
        controller: 'SignInResetCtrl',
        data : {
          pageTitle: 'Reset Password',
          headTitle: ': ' + 'Reset Password',
          access: {
            requireUnauthenticated: true
          }
        }
      })
      .state(states.signOut.name, {
        url: '/sign-out',
        templateUrl: 'views/signout.html',
        controller: 'SignOutCtrl',
        data : {
          pageTitle: 'Sign Out',
          headTitle: ': ' + 'Sign Out',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.account.name, {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        data : {
          pageTitle: 'My Account',
          headTitle: ': ' + 'My Account',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.name, {
        abstract: false,
        url: '/creators',
        templateUrl: 'views/creators/index.html',
        redirectTo: states.creators.landingPage.name,
        data : {
          pageTitle: 'Creators',
          headTitle: ': ' + 'Creators',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.createSubscription.name, {
        url: '/create-subscription',
        templateUrl: 'views/creators/create-subscription.html',
        controller: 'createSubscriptionCtrl',
        requireSubscription: false,
        data : {
          pageTitle: 'Create Your Subscription',
          headTitle: ': ' + 'Create Subscription',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.landingPage.name, {
        url: '/landing-page',
        templateUrl: 'views/creators/landing-page.html',
        controller: 'landingPageCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Landing page',
          headTitle: ': ' + 'Landing page',
          disableSidebar: true,
          bodyClass: 'page-landing',
          access: {
            requireAuthenticated: false // Disable the inherited access requirement.
          }
        }
      })
      .state(states.creators.compose.name, {
        url: '/compose',
        templateUrl: 'views/creators/compose/index.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Compose',
          headTitle: ': ' + 'Compose',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.note.name, {
        url: '/note',
        templateUrl: 'views/creators/compose/note.html',
        controller: 'noteCtrl',
        requireSubscription: true,
        data : {
          pageTitle: ' Note',
          headTitle: ': ' + 'New Note',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.image.name, {
        url: '/image',
        templateUrl: 'views/creators/compose/image.html',
        requireSubscription: true,
        data : {
          pageTitle: ' Image',
          headTitle: ': ' + 'New Image',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.file.name, {
        url: '/file',
        templateUrl: 'views/creators/compose/file.html',
        requireSubscription: true,
        data : {
          pageTitle: ' File',
          headTitle: ': ' + 'New File'
        }
      })
      .state(states.creators.customize.name, {
        url: '/customize',
        templateUrl: 'views/creators/customize/index.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Customize',
          headTitle: ': ' + 'Customize',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.landingPage.name, {
        url: '/landing-page',
        templateUrl: 'views/creators/customize/landingpage.html',
        controller: 'customizeLandingPageCtrl',
        requireSubscription: true,
        data : {
          pageTitle: ' Landing page',
          headTitle: ': ' + 'Landing page'
        }
      })
      .state(states.creators.customize.collections.name, {
        url: '/collections',
        templateUrl: 'views/creators/customize/collections.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Collections',
          headTitle: ': ' + 'Collections',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.channels.name, {
        url: '/channels',
        templateUrl: 'views/creators/customize/channels.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Channels',
          headTitle: ': ' + 'Channels',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.help.name, {
        abstract: false,
        url: '/help',
        templateUrl: 'views/help/index.html',
        redirectTo: states.help.faq.name,
        data : {
          pageTitle: 'Help',
          headTitle: ': ' + 'Help'
        }
      })
      .state(states.help.faq.name, {
        url: '/faq',
        templateUrl: 'views/help/faq.html',
        data : {
          pageTitle: 'Frequently Asked Questions',
          headTitle: ': ' + 'FAQ'
        }
      })
      .state(states.help.contact.name, {
        url: '/contact',
        templateUrl: 'views/help/contact-us.html',
        data : {
          pageTitle: 'Contact Us',
          headTitle: ': ' + 'Contact Us'
        }
      })
      .state(states.help.legal.name, {
        abstract: false,
        url: '/legal',
        templateUrl: 'views/help/legal/index.html',
        redirectTo: states.help.legal.termsOfService.name,
        data : {
          pageTitle: 'Legal',
          headTitle: ': ' + 'Legal'
        }
      })
      .state(states.help.legal.termsOfService.name, {
        url: '/terms-of-service',
        templateUrl: 'views/help/legal/terms-of-service.html',
        data : {
          pageTitle: 'Terms of Service',
          headTitle: ': ' + 'Terms of Service'
        }
      })
      .state(states.help.legal.privacyPolicy.name, {
        url: '/privacy-policy',
        templateUrl: 'views/help/legal/privacy-policy.html',
        data : {
          pageTitle: 'Privacy Policy',
          headTitle: ': ' + 'Privacy Policy'
        }
      })
      .state(states.notAuthorized.name, {
        url: '/not-authorized',
        templateUrl: 'views/not-authorized/not-authorized.html',
        data : {
          pageTitle: 'Not Authorized',
          headTitle: ': ' + 'Not Authorized'
        }
      });
});
