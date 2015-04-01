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
    dashboard: {
      name: 'dashboard',
      newsFeed: {
        name: 'dashboard.newsFeed'
      },
      notifications: {
        name: 'dashboard.notifications'
      }
    },
    creators: {
      name: 'creators',
      createSubscription: {
        name: 'creators.createSubscription'
      },
      blog: {
        name: 'creators.blog',
        posts: {
          name: 'creators.blog.posts'
        },
        landingPage: {
          name: 'creators.blog.landingPage'
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
      subscription: {
        name: 'creators.subscription',
        landingPage: {
          name: 'creators.subscription.landingPage'
        },
        collections: {
          name: 'creators.subscription.collections',
          new: {
            name: 'creators.subscription.collections.new'
          },
          edit: {
            name: 'creators.subscription.collections.edit'
          },
          list: {
            name: 'creators.subscription.collections.list'
          }
        },
        channels: {
          name: 'creators.subscription.channels',
          new: {
            name: 'creators.subscription.channels.new'
          },
          edit: {
            name: 'creators.subscription.channels.edit'
          },
          list: {
            name: 'creators.subscription.channels.list'
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
        templateUrl: 'modules/common/ui-view.html',
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
        templateUrl: 'modules/account/account.html',
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
      .state(states.dashboard.name, {
        abstract: false,
        url: '/home',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.dashboard.newsFeed.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.dashboard.newsFeed.name, {
        url: '/timeline',
        templateUrl: 'modules/newsfeed/newsfeed.html',
        data : {
          pageTitle: 'News Feed',
          headTitle: ': ' + 'News Feed',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.dashboard.notifications.name, {
        url: '/notifications',
        templateUrl: 'modules/notifications/notifications.html',
        data : {
          pageTitle: 'Notifications',
          headTitle: ': ' + 'Notifications',
          bodyClass: 'page-notifications',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.name, {
        abstract: false,
        url: '/creator',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creators.blog.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.createSubscription.name, {
        url: '/create-subscription',
        templateUrl: 'modules/creator-subscription/create-subscription.html',
        controller: 'createSubscriptionCtrl',
        requireSubscription: false,
        data : {
          pageTitle: 'About Your Blog',
          headTitle: ': ' + 'Create Blog',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.blog.name, {
        abstract: false,
        url: '/blog',
        templateUrl: 'modules/common/ui-view.html',
        requireSubscription: true,
        redirectTo: states.creators.blog.posts.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.blog.posts.name, {
        url: '/posts',
        templateUrl: 'modules/creator-posts/creator-posts.html',
        controller: 'timelineCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Live Posts',
          headTitle: ': ' + 'Live Posts',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.blog.landingPage.name, {
        url: '/landing-page',
        templateUrl: 'modules/creator-timeline/creator-timeline.html',
        controller: 'timelineCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Landing Page',
          headTitle: ': ' + 'Landing Page',
          navigationHidden: true,
          bodyClass: 'page-timeline',
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
          pageTitle: 'Scheduled Posts',
          headTitle: ': ' + 'Scheduled Posts',
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
      .state(states.creators.subscription.name, {
        url: '/subscription',
        redirectTo: states.creators.subscription.landingPage.name,
        templateUrl: 'modules/common/ui-view.html',
        requireSubscription: true,
        data : {
          pageTitle: 'Subscriptions',
          headTitle: ': ' + 'Subscriptions',
          bodyClass: 'page-subscription',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.landingPage.name, {
        url: '/landing-page',
        templateUrl: 'modules/creator-subscription/customize-landing-page.html',
        controller: 'customizeLandingPageCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Blog Appearance',
          headTitle: ': ' + 'Appearance',
          bodyClass: 'page-subscription-landing'
        }
      })
      .state(states.creators.subscription.collections.name, {
        url: '/collections',
        templateUrl: 'modules/common/ui-view.html',
        requireSubscription: true,
        redirectTo: states.creators.subscription.collections.list.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.collections.new.name, {
        url: '/new',
        templateUrl: 'modules/collections/new-collection.html',
        controller: 'newCollectionCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Create Collection',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.collections.edit.name, {
        url: '/{id}',
        templateUrl: 'modules/collections/edit-collection.html',
        controller: 'editCollectionCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Edit Collection',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.collections.list.name, {
        url: '',
        templateUrl: 'modules/collections/list-collections.html',
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
      .state(states.creators.subscription.channels.name, {
        url: '/channels',
        templateUrl: 'modules/common/ui-view.html',
        requireSubscription: true,
        redirectTo: states.creators.subscription.channels.list.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.channels.new.name, {
        url: '/new',
        templateUrl: 'modules/channels/new-channel.html',
        controller: 'newChannelCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Create Channel',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.channels.edit.name, {
        url: '/{id}',
        templateUrl: 'modules/channels/edit-channel.html',
        controller: 'editChannelCtrl',
        requireSubscription: true,
        data : {
          headTitle: ': ' + 'Edit Channel',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creators.subscription.channels.list.name, {
        url: '',
        templateUrl: 'modules/channels/list-channels.html',
        controller: 'listChannelsCtrl',
        requireSubscription: true,
        data : {
          pageTitle: 'Subscriptions',
          headTitle: ': ' + 'Subscriptions',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.help.name, {
        abstract: false,
        url: '/help',
        templateUrl: 'modules/common/ui-view.html',
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
