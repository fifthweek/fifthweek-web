angular.module('webApp')
  .factory('navigationMap', function(aggregateUserStateUtilities, states) {
    'use strict';

    return [
      {
        name: 'Sign In',
        state: states.signIn.name,
        icon: 'fa fa-sign-in',
        color: 'green',
        secondary:
        [
          {
            name: 'Sign In',
            state: states.signIn.name,
            icon: 'fa fa-sign-in',
            color: 'green'
          }
        ]
      },
      {
        name: 'Subscriptions',
        state: states.user.newsFeed.name,
        icon: 'fa fa-align-left',
        secondary:
        [
          {
            name: 'Latest Posts',
            state: states.user.newsFeed.name,
            icon: 'fa fa-align-left'
          },
          {
            name: 'Manage',
            state: states.user.viewSubscriptions.name,
            icon: 'fa fa-list'
          },
          {
            name: 'Payment',
            state: states.user.paymentInformation.name,
            icon: 'fa fa-credit-card'
          }
        ]
      },
      {
        separator: true
      },
      {
        name: 'Preview Blog',
        state: states.creator.landingPage.preview.name,
        icon: 'fa fa-bookmark-o',
        secondary:
        [
          {
            name: 'Preview',
            state: states.creator.landingPage.preview.name,
            icon: 'fa fa-eye'
          },
          {
            name: 'Edit Page',
            state: states.creator.landingPage.edit.name,
            icon: 'fa fa-pencil'
          }
        ]
      },
      {
        name: 'Posts',
        state: states.creator.posts.name,
        icon: 'fa fa-file-text-o',
        secondary:
        [
          {
            name: 'Live Now',
            state: states.creator.posts.live.name,
            icon: 'fa fa-file-text-o'
          },
          {
            name: 'Scheduled',
            state: states.creator.posts.scheduled.list.name,
            icon: 'fa fa-clock-o'
          }
        ]
      },
      {
        name: 'Create Blog',
        state: states.creator.createBlog.name,
        icon: 'fa fa-asterisk'
      },
      {
        name: 'Collections',
        state: states.creator.collections.name,
        icon: 'fa fa-th',
        secondary:
          [
            {
              name: 'Collections',
              state: states.creator.collections.name,
              icon: 'fa fa-th'
            }
          ]
      },
      {
        name: 'Channels',
        state: states.creator.channels.name,
        icon: 'fa fa-check-square-o',
        secondary:
          [
            {
              name: 'Channels',
              state: states.creator.channels.name,
              icon: 'fa fa-check-square-o'
            }
          ]
      },
      {
        name: 'Subscribers',
        state: states.creator.subscribers.name,
        icon: 'fa fa-users',
        secondary:
          [
            {
              name: 'All',
              state: states.creator.subscribers.all.name,
              icon: 'fa fa-users'
            },
            {
              name: 'Guest List',
              state: states.creator.subscribers.guestList.name,
              icon: 'fa fa-street-view'
            }
          ]
      },
      { separator: true },
      {
        id: 'account',
        name: aggregateUserStateUtilities.getUsername,
        state: states.user.account.name,
        icon: 'fa fa-user',
        secondary:
          [
            {
              name: 'Account Settings',
              state: states.user.account.name,
              icon: 'fa fa-user'
            },
            {
              name: 'Creator Settings',
              state: states.user.creatorAccount.name,
              icon: 'fa fa-pencil'
            },
            {
              name: 'Sign Out',
              state: states.user.signOut.name,
              icon: 'fa fa-sign-out'
            }
          ]
      },
      {
        name: 'Help',
        state: states.support.help.name,
        icon: 'fa fa-question-circle'
      },
      {
        name: 'Admin',
        state: states.admin.name,
        icon: 'fa fa-user-plus',
        secondary:
        [
          {
            name: 'Lookup',
            state: states.admin.lookup.name,
            icon: 'fa fa-eye'
          },
          {
            name: 'Transactions',
            state: states.admin.transactions.name,
            icon: 'fa fa-money'
          },
          {
            name: 'Impersonation',
            state: states.admin.impersonation.name,
            icon: 'fa fa-user-secret'
          }
        ]
      }
    ];
  });
