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
    user: {
      name: 'user',
      timeline: {
        name: 'user.timeline'
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
      backlog: {
        name: 'creators.backlog',
        futurePosts: {
          name: 'creators.backlog.futurePosts'
        },
        queues: {
          name: 'creators.backlog.queues',
          queues: {
            name: 'creators.backlog.queues.queues'
          },
          reorder: {
            name: 'creators.backlog.queues.reorder'
          }
        }
      },
      customize: {
        name: 'creators.customize',
        landingPage: {
          name: 'creators.customize.landingPage'
        },
        collections: {
          name: 'creators.customize.collections',
          new: {
            name: 'creators.customize.collections.new'
          },
          edit: {
            name: 'creators.customize.collections.edit'
          },
          list: {
            name: 'creators.customize.collections.list'
          }
        },
        channels: {
          name: 'creators.customize.channels',
          new: {
            name: 'creators.customize.channels.new'
          },
          edit: {
            name: 'creators.customize.channels.edit'
          },
          list: {
            name: 'creators.customize.channels.list'
          }
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
          navigationHidden: true,
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
          bodyClass: 'page-account-settings',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.user.name, {
        abstract: false,
        url: '/my',
        templateUrl: 'views/creators/index.html',
        redirectTo: states.user.timeline.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.user.timeline.name, {
        url: '/landing-page',
        templateUrl: 'modules/creator-timeline/creator-timeline.html',
        controller: 'timelineCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Timeline',
          headTitle: ': ' + 'Timeline',
          navigationHidden: true,
          bodyClass: 'page-timeline',
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
          pageTitle: 'About Your Subscription',
          headTitle: ': ' + 'Create Subscription',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.name, {
        url: '/compose',
        templateUrl: 'modules/common/ui-view.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Compose',
          headTitle: ': ' + 'Compose',
          bodyClass: 'page-creators-compose',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.note.name, {
        url: '/note',
        templateUrl: 'modules/creator-compose/compose-note.html',
        controller: 'composeNoteCtrl',
        requireSubscription: true,
        data : {
          pageTitle: ' Note',
          headTitle: ': ' + 'New Note',
          bodyClass: 'page-creators-compose-note',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.image.name, {
        url: '/image',
        templateUrl: 'modules/creator-compose/compose-upload.html',
        controller: 'composeImageCtrl',
        requireSubscription: true,
        data : {
          pageTitle: ' Image',
          headTitle: ': ' + 'New Image',
          bodyClass: 'page-creators-compose-image',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.compose.file.name, {
        url: '/file',
        templateUrl: 'modules/creator-compose/compose-upload.html',
        controller: 'composeFileCtrl',
        requireSubscription: true,
        data : {
          pageTitle: ' File',
          headTitle: ': ' + 'New File',
          bodyClass: 'page-creators-compose-file',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.backlog.name, {
        url: '/backlog',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creators.backlog.futurePosts.name,
        requireSubscription: true,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.backlog.futurePosts.name, {
        url: '',
        templateUrl: 'modules/creator-backlog/backlog-post-list.html',
        controller: 'backlogPostListCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Future Posts',
          headTitle: ': ' + 'Future Posts',
          bodyClass: 'page-creators-backlog-post-list',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.backlog.queues.name, {
        url: '/queues',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creators.backlog.queues.queues.name,
        requireSubscription: true,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.backlog.queues.queues.name, {
        url: '/',
        templateUrl: 'modules/creator-backlog/backlog-queue-list.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Queues',
          headTitle: ': ' + 'Queues',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.backlog.queues.reorder.name, {
        url: '/{id}',
        templateUrl: 'modules/creator-backlog/backlog-queue-reorder.html',
        controller: 'queueReorderCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Reorder Queue',
          headTitle: ': ' + 'Reorder Queues',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.name, {
        url: '/customize',
        templateUrl: 'views/creators/customize/index.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Customize',
          headTitle: ': ' + 'Customize',
          bodyClass: 'page-customize',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.landingPage.name, {
        url: '/landing-page',
        templateUrl: 'views/creators/customize/landing-page/index.html',
        controller: 'customizeLandingPageCtrl',
        requireSubscription: true,
        data : {
          pageTitle: ' Landing page',
          headTitle: ': ' + 'Landing page',
          bodyClass: 'page-customize-landing'
        }
      })
      .state(states.creators.customize.collections.name, {
        url: '/collections',
        templateUrl: 'views/creators/customize/collections/index.html',
        requireSubscription: true,
        redirectTo: states.creators.customize.collections.list.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.collections.new.name, {
        url: '/new',
        templateUrl: 'views/creators/customize/collections/new.html',
        controller: 'newCollectionCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Create Collection',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.collections.edit.name, {
        url: '/{id}',
        templateUrl: 'views/creators/customize/collections/edit.html',
        controller: 'editCollectionCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Edit Collection',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.collections.list.name, {
        url: '',
        templateUrl: 'views/creators/customize/collections/list.html',
        controller: 'listCollectionsCtrl',
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
        templateUrl: 'views/creators/customize/channels/index.html',
        requireSubscription: true,
        redirectTo: states.creators.customize.channels.list.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.channels.new.name, {
        url: '/new',
        templateUrl: 'views/creators/customize/channels/new.html',
        controller: 'newChannelCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Create Channel',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.channels.edit.name, {
        url: '/{id}',
        templateUrl: 'views/creators/customize/channels/edit.html',
        controller: 'editChannelCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Edit Channel',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.customize.channels.list.name, {
        url: '',
        templateUrl: 'views/creators/customize/channels/list.html',
        controller: 'listChannelsCtrl',
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
          headTitle: ': ' + 'Help',
          bodyClass: 'page-help'
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
