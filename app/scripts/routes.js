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
    register: {
      name: 'register'
    },
    landingPage: {
      name: 'landingPage'
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
      creatorAccount: {
        name: 'user.creatorAccount'
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
    features: {
      name: 'features',
      all: {
        name: 'features.all'
      },
      forCreators: {
        name: 'features.forCreators'
      },
      forSubscribers: {
        name: 'features.forSubscribers'
      },
      vsPatreon: {
        name: 'features.vsPatreon'
      },
      vsTapastic: {
        name: 'features.vsTapastic'
      },
      vsWordPress: {
        name: 'features.vsWordPress'
      }
    },
    about: {
      name: 'about',
      about: {
        name: 'about.about'
      },
      team: {
        name: 'about.team'
      }
    },
    pricing: {
      name: 'pricing'
    },
    termsOfService: {
      name: 'termsOfService'
    },
    privacyPolicy: {
      name: 'privacyPolicy'
    },
    gettingStarted: {
      name: 'gettingStarted'
    },
    support: {
      name: 'support',
      faq: {
        name: 'support.faq'
      },
      contact: {
        name: 'support.contact'
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
    $urlRouterProvider.otherwise('/not-found');

    $stateProvider
      .state(states.home.name, {
        url: '/',
        templateUrl: 'modules/information/pages/home.html',
        data: {
          pageTitle: 'Home',
          headDescription: 'Fifthweek lets you effortlessly share anything with paying subscribers, so you can make a living doing what you love.',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.register.name, {
        url: '/register',
        templateUrl: 'modules/registration/register.html',
        controller: 'RegisterCtrl',
        data : {
          pageTitle: 'Creator Registration',
          headTitle: ': ' + 'Creator Registration',
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
          pageTitle: 'Account Settings',
          headTitle: ': ' + 'Account Settings',
          bodyClass: 'page-account-settings',
          access: {
            requireAuthenticated: true
          }
        }
      })
      .state(states.user.creatorAccount.name, {
        url: '/creator-account',
        templateUrl: 'modules/account/creator-account-settings.html',
        controller: 'creatorAccountSettingsCtrl',
        data : {
          pageTitle: 'Creator Account Settings',
          headTitle: ': ' + 'Creator Account Settings',
          bodyClass: 'page-creator-account-settings',
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
            requireAuthenticated: true,
            roles: [authenticationServiceConstants.roles.creator]
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
          headTitle: ': ' + 'Create Blog'
        }
      })
      .state(states.creator.landingPage.name, {
        abstract: false,
        url: '/landing-page',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.landingPage.edit.name,
        requireBlog: true,
        data : {
        }
      })
      .state(states.creator.landingPage.preview.name, {
        url: '/preview',
        controller: 'landingPageRedirectCtrl',
        requireBlog: true,
        data : {
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
        }
      })
      .state(states.creator.posts.live.name, {
        url: '/live',
        templateUrl: 'modules/creator-posts/creator-posts.html',
        requireBlog: true,
        data : {
          pageTitle: 'Live Posts',
          headTitle: ': ' + 'Live Posts'
        }
      })
      .state(states.creator.posts.scheduled.name, {
        url: '/scheduled',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.posts.scheduled.list.name,
        requireBlog: true,
        data : {
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
          bodyClass: 'page-creator-backlog-post-list'
        }
      })
      .state(states.creator.posts.scheduled.queues.name, {
        url: '/queues',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.creator.posts.scheduled.queues.list.name,
        requireBlog: true,
        data : {
        }
      })
      .state(states.creator.posts.scheduled.queues.list.name, {
        url: '/',
        templateUrl: 'modules/creator-backlog/backlog-queue-list.html',
        requireBlog: true,
        data : {
          pageTitle: 'Queues',
          headTitle: ': ' + 'Queues'
        }
      })
      .state(states.creator.posts.scheduled.queues.reorder.name, {
        url: '/{id}',
        templateUrl: 'modules/creator-backlog/backlog-queue-reorder.html',
        controller: 'queueReorderCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Reorder Queue',
          headTitle: ': ' + 'Reorder Queues'
        }
      })
      .state(states.creator.collections.name, {
        url: '/collections',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.collections.list.name,
        data : {
        }
      })
      .state(states.creator.collections.new.name, {
        url: '/new',
        templateUrl: 'modules/collections/new-collection.html',
        controller: 'newCollectionCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Create Collection'
        }
      })
      .state(states.creator.collections.edit.name, {
        url: '/{id}',
        templateUrl: 'modules/collections/edit-collection.html',
        controller: 'editCollectionCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Edit Collection'
        }
      })
      .state(states.creator.collections.list.name, {
        url: '',
        templateUrl: 'modules/collections/list-collections.html',
        controller: 'listCollectionsCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Collections',
          headTitle: ': ' + 'Collections'
        }
      })
      .state(states.creator.channels.name, {
        url: '/channels',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.channels.list.name,
        data : {
        }
      })
      .state(states.creator.channels.new.name, {
        url: '/new',
        templateUrl: 'modules/channels/new-channel.html',
        controller: 'newChannelCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Create Channel'
        }
      })
      .state(states.creator.channels.edit.name, {
        url: '/{id}',
        templateUrl: 'modules/channels/edit-channel.html',
        controller: 'editChannelCtrl',
        requireBlog: true,
        data : {
          headTitle: ': ' + 'Edit Channel'
        }
      })
      .state(states.creator.channels.list.name, {
        url: '',
        templateUrl: 'modules/channels/list-channels.html',
        controller: 'listChannelsCtrl',
        requireBlog: true,
        data : {
          pageTitle: 'Blogs',
          headTitle: ': ' + 'Blogs'
        }
      })
      .state(states.creator.subscribers.name, {
        url: '/subscribers',
        templateUrl: 'modules/common/ui-view.html',
        requireBlog: true,
        redirectTo: states.creator.subscribers.guestList.name,
        data : {
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
          headTitle: ': ' + 'Guest List'
        }
      })
      .state(states.features.name, {
        url: '/features',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.features.all.name
      })
      .state(states.features.all.name, {
        url: '',
        templateUrl: 'modules/information/pages/all-features.html',
        data : {
          headTitle: ': ' + 'Features',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.features.forCreators.name, {
        url: '/for-creators',
        templateUrl: 'modules/information/pages/for-creators.html',
        data : {
          headTitle: ': ' + 'For Creators',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.features.forSubscribers.name, {
        url: '/for-subscribers',
        templateUrl: 'modules/information/pages/for-subscribers.html',
        data : {
          headTitle: ': ' + 'For Subscribers',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.features.vsPatreon.name, {
        url: '/patreon-comparison',
        templateUrl: 'modules/information/pages/vs-patreon.html',
        data : {
          headTitle: ': ' + 'Patreon Comparison',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.features.vsTapastic.name, {
        url: '/tapastic-comparison',
        templateUrl: 'modules/information/pages/vs-tapastic.html',
        data : {
          headTitle: ': ' + 'Tapastic Comparison',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.features.vsWordPress.name, {
        url: '/wordpress-comparison',
        templateUrl: 'modules/information/pages/vs-wordpress.html',
        data : {
          headTitle: ': ' + 'WordPress Comparison',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.about.name, {
        url: '/about',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.about.about.name
      })
      .state(states.about.about.name, {
        url: '',
        templateUrl: 'modules/information/pages/about.html',
        data : {
          headTitle: ': ' + 'About',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.about.team.name, {
        url: '/team',
        templateUrl: 'modules/information/pages/team.html',
        data : {
          headTitle: ': ' + 'Meet the Team',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.pricing.name, {
        url: '/pricing',
        templateUrl: 'modules/information/pages/pricing.html',
        data : {
          headTitle: ': ' + 'Pricing',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.termsOfService.name, {
        url: '/terms',
        templateUrl: 'modules/information/pages/terms-and-conditions.html',
        data : {
          headTitle: ': ' + 'Terms and Conditions',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.privacyPolicy.name, {
        url: '/privacy',
        templateUrl: 'modules/information/pages/privacy-policy.html',
        data : {
          headTitle: ': ' + 'Privacy Policy',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.gettingStarted.name, {
        url: '/getting-started',
        templateUrl: 'modules/information/pages/getting-started.html',
        data : {
          headTitle: ': ' + 'Getting Started',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.support.name, {
        abstract: false,
        url: '/support',
        templateUrl: 'modules/common/ui-view.html',
        redirectTo: states.support.contact.name
      })
      .state(states.support.faq.name, {
        url: '/faq',
        templateUrl: 'modules/information/pages/faq.html',
        data : {
          headTitle: ': ' + 'FAQ',
          navigationHidden: true,
          bodyClass: 'info-page'
        }
      })
      .state(states.support.contact.name, {
        url: '/contact',
        templateUrl: 'modules/information/pages/contact.html',
        data : {
          headTitle: ': ' + 'Contact Us',
          navigationHidden: true,
          bodyClass: 'info-page'
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
      })
      .state(states.landingPage.name, {
        url: '/{username:[a-zA-Z0-9_]{2,20}}',
        templateUrl: 'modules/landing-page/landing-page.html',
        controller: 'landingPageCtrl',
        data : {
          pageTitle: 'Landing Page',
          headTitle: ': ' + 'Landing Page',
          navigationHidden: true,
          bodyClass: 'page-landing-page',
          access: {
            requireAuthenticated: false
          }
        }
      });
});
