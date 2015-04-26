'use strict';

angular.module('webApp')
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
    user: {
      name: 'user',
      signOut: {
        name: 'user.signOut'
      },
      account: {
        name: 'user.account'
      },
      newsFeed: {
        name: 'user.newsFeed'
      },
      notifications: {
        name: 'user.notifications'
      }
    },
    creator: {
      name: 'creator',
      createBlog: {
        name: 'creator.createBlog'
      },
      landingPage: {
        name: 'creator.landingPage',
        preview: {
          name: 'creator.landingPage.preview'
        },
        edit: {
          name: 'creator.landingPage.edit'
        }
      },
      posts: {
        name: 'creator.posts',
        live: {
          name: 'creator.posts.live'
        },
        scheduled: {
          name: 'creator.posts.scheduled',
          list: {
            name: 'creator.posts.scheduled.list'
          },
          queues: {
            name: 'creator.posts.scheduled.queues',
            list: {
              name: 'creator.posts.scheduled.queues.list'
            },
            reorder: {
              name: 'creator.posts.scheduled.queues.reorder'
            }
          }
        }
      },
      collections: {
        name: 'creator.collections',
        new: {
          name: 'creator.collections.new'
        },
        edit: {
          name: 'creator.collections.edit'
        },
        list: {
          name: 'creator.collections.list'
        }
      },
      channels: {
        name: 'creator.channels',
        new: {
          name: 'creator.channels.new'
        },
        edit: {
          name: 'creator.channels.edit'
        },
        list: {
          name: 'creator.channels.list'
        }
      },
      subscribers: {
        name: 'creator.subscribers',
        guestList: {
          name: 'creator.subscribers.guestList'
        }
      }
    },
    help: {
      name: 'help',
      about: {
        name: 'help.about'
      },
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
    },
    notFound: {
      name: 'notFound'
    },
    comingSoon: {
      name: 'comingSoon'
    }
  })
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, states, authenticationServiceConstants) {

    $locationProvider.html5Mode(true);

    //for any unmatched url, redirect to home page
    $urlRouterProvider.otherwise('/coming-soon');

    $stateProvider
      .state(states.home.name, {
        url: '/',
        templateUrl: 'modules/sales-pitches/home.html',
        data: {
          pageTitle: 'Home',
          navigationHidden: true,
          bodyClass: 'pitch pitch-home',
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
      .state(states.user.name, {
        url: '/user',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.user.newsFeed.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.user.account.name, {
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
      .state(states.user.signOut.name, {
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
      .state(states.user.newsFeed.name, {
        url: '/news-feed',
        templateUrl: 'modules/newsfeed/newsfeed.html',
        data : {
          pageTitle: 'News Feed',
          headTitle: ': ' + 'News Feed',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.user.notifications.name, {
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
      .state(states.creator.name, {
        abstract: false,
        url: '/creator',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.posts.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.createBlog.name, {
        url: '/create-blog',
        templateUrl: 'modules/creator-blog/create-blog.html',
        controller: 'createBlogCtrl',
        requireBlog: false,
        data : {
          pageTitle: 'About Your Blog',
          headTitle: ': ' + 'Create Blog',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.landingPage.name, {
        abstract: false,
        url: '/landing-page',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.landingPage.preview.name,
        requireBlog: true,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.landingPage.preview.name, {
        url: '/preview',
        templateUrl: 'modules/creator-timeline/creator-timeline.html',
        controller: 'timelineCtrl',
        requireBlog: true,
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
      .state(states.creator.landingPage.edit.name, {
        url: '/edit',
        templateUrl: 'modules/creator-blog/customize-landing-page.html',
        controller: 'customizeLandingPageCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Edit Appearance',
          headTitle: ': ' + 'Edit Appearance',
          bodyClass: 'page-blog-landing'
        }
      })
      .state(states.creator.posts.name, {
        abstract: false,
        url: '/posts',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.posts.live.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.posts.live.name, {
        url: '/live',
        templateUrl: 'modules/creator-posts/creator-posts.html',
        controller: 'timelineCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Live Posts',
          headTitle: ': ' + 'Live Posts',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.posts.scheduled.name, {
        url: '/scheduled',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.posts.scheduled.list.name,
        requireBlog: true,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.posts.scheduled.list.name, {
        url: '',
        templateUrl: 'modules/creator-backlog/backlog-post-list.html',
        controller: 'backlogPostListCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Scheduled Posts',
          headTitle: ': ' + 'Scheduled Posts',
          bodyClass: 'page-creator-backlog-post-list',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.posts.scheduled.queues.name, {
        url: '/queues',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.posts.scheduled.queues.list.name,
        requireBlog: true,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.posts.scheduled.queues.list.name, {
        url: '/',
        templateUrl: 'modules/creator-backlog/backlog-queue-list.html',
        requireBlog: true,
        data : {
          pageTitle: 'Queues',
          headTitle: ': ' + 'Queues',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.posts.scheduled.queues.reorder.name, {
        url: '/{id}',
        templateUrl: 'modules/creator-backlog/backlog-queue-reorder.html',
        controller: 'queueReorderCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Reorder Queue',
          headTitle: ': ' + 'Reorder Queues',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.collections.name, {
        url: '/collections',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.collections.list.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.collections.new.name, {
        url: '/new',
        templateUrl: 'modules/collections/new-collection.html',
        controller: 'newCollectionCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Create Collection',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.collections.edit.name, {
        url: '/{id}',
        templateUrl: 'modules/collections/edit-collection.html',
        controller: 'editCollectionCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Edit Collection',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.collections.list.name, {
        url: '',
        templateUrl: 'modules/collections/list-collections.html',
        controller: 'listCollectionsCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Collections',
          headTitle: ': ' + 'Collections',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.channels.name, {
        url: '/channels',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.channels.list.name,
        data : {
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.channels.new.name, {
        url: '/new',
        templateUrl: 'modules/channels/new-channel.html',
        controller: 'newChannelCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Create Channel',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.channels.edit.name, {
        url: '/{id}',
        templateUrl: 'modules/channels/edit-channel.html',
        controller: 'editChannelCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Edit Channel',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.channels.list.name, {
        url: '',
        templateUrl: 'modules/channels/list-channels.html',
        controller: 'listChannelsCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Blogs',
          headTitle: ': ' + 'Blogs',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.creator.subscribers.name, {
        url: '/subscribers',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.subscribers.guestList.name,
        data : {
          access: {
            requireAuthenticated: true,
            roles: [authenticationServiceConstants.roles.preRelease]
          }
        }
      })
      .state(states.creator.subscribers.guestList.name, {
        url: '/guest-list',
        templateUrl: 'modules/guest-list/guest-list.html',
        controller: 'guestListCtrl',
        requireBlog: true,
        data : {
          bodyClass: 'page-guest-list',
          pageTitle: 'Guest List',
          headTitle: ': ' + 'Guest List',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.help.name, {
        abstract: false,
        url: '/help',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.help.about.name,
        data : {
          pageTitle: 'Help',
          headTitle: ': ' + 'Help',
          bodyClass: 'page-help'
        }
      })
      .state(states.help.about.name, {
        url: '/about',
        templateUrl: 'views/help/about.html',
        data : {
          bodyClass: 'page-help-about',
          pageTitle: 'About Us',
          headTitle: ': ' + 'About Us'
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
        templateUrl: 'views/not-authorized.html',
        data : {
          pageTitle: 'Not Authorized',
          headTitle: ': ' + 'Not Authorized'
        }
      })
      .state(states.notFound.name, {
        url: '/not-found',
        templateUrl: 'views/not-found.html',
        data : {
          pageTitle: 'Not Found',
          headTitle: ': ' + 'Not Found'
        }
      })
      .state(states.comingSoon.name, {
        url: '/coming-soon',
        templateUrl: 'views/coming-soon.html',
        data : {
          pageTitle: 'Coming Soon',
          headTitle: ': ' + 'Coming Soon'
        }
      });
});
