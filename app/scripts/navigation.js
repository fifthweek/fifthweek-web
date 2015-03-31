angular.module('webApp')
  .factory('navigationMap', function(aggregateUserStateUtilities, states) {
    'use strict';

    return [
      {
        name: 'Register',
        state: states.home.name,
        icon: 'fa fa-ticket',
        color: 'pink'
      },
      {
        name: 'Sign In',
        state: states.signIn.name,
        icon: 'fa fa-sign-in',
        color: 'green'
      },
      {
        name: 'Home',
        state: states.dashboard.name,
        icon: 'fa fa-home',
        color: 'pink',
        secondary:
        [
          {
            name: 'News Feed',
            state: states.dashboard.newsFeed.name,
            icon: 'fa fa-align-left',
            color: 'orange'
          },
          {
            name: 'Notifications',
            state: states.dashboard.notifications.name,
            icon: 'fa fa-bell-o',
            color: 'orange'
          }
        ]
      },
      {
        name: 'Landing Page',
        state: states.creators.blog.landingPage.name,
        icon: 'fa fa-bookmark-o',
        color: 'pink'
      },
      {
        separator: true
      },
      {
        name: 'Posts',
        state: states.creators.blog.name,
        icon: 'fa fa-file-text-o',
        color: 'orange',
        secondary:
        [
          {
            name: 'Live Now',
            state: states.creators.blog.posts.name,
            icon: 'fa fa-file-text-o',
            color: 'pink'
          },
          {
            name: 'Queued',
            state: states.creators.backlog.futurePosts.name,
            icon: 'fa fa-clock-o',
            color: 'yellow'
          }
        ]
      },
      {
        name: 'Create Subscription',
        state: states.creators.createSubscription.name,
        icon: 'fa fa-asterisk',
        color: 'yellow'
      },
      {
        name: 'Channels',
        state: states.creators.subscription.channels.name,
        icon: 'fa fa-check-square-o',
        color: 'green',
        secondary:
        [
          {
            name: 'Channels',
            state: states.creators.subscription.channels.name,
            icon: 'fa fa-check-square-o',
            color: 'green'
          }
        ]
      },
      {
        name: 'Collections',
        state: states.creators.subscription.collections.name,
        icon: 'fa fa-th',
        color: 'green',
        secondary:
        [
          {
            name: 'Collections',
            state: states.creators.subscription.collections.name,
            icon: 'fa fa-th',
            color: 'green'
          }
        ]
      },
      { separator: true },
      {
        name: aggregateUserStateUtilities.getUsername,
        state: states.account.name,
        icon: 'fa fa-user',
        color: 'blue',
        secondary:
          [
            {
              name: 'Account Settings',
              state: states.account.name,
              icon: 'fa fa-user',
              color: 'blue'
            },
            {
              name: 'Sign Out',
              state: states.signOut.name,
              icon: 'fa fa-sign-out',
              color: 'blue'
            }
          ]
      },
      {
        name: 'Help',
        state: states.help.faq.name,
        icon: 'fa fa-question-circle',
        color: 'indigo',
        secondary:
        [
          {
            name: 'FAQ',
            state: states.help.faq.name,
            icon: 'fa fa-book',
            color: 'indigo'
          },
          {
            name: 'Contact Us',
            state: states.help.contact.name,
            icon: 'fa fa-comment-o',
            color: 'indigo'
          },
          {
            name: 'Legal',
            state: states.help.legal.name,
            icon: 'fa fa-files-o',
            color: 'indigo'
          }
        ]
      }
    ];
  });
