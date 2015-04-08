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
        state: states.creators.landingPage.name,
        icon: 'fa fa-bookmark-o',
        color: 'pink',
        secondary:
        [
          {
            name: 'Preview',
            state: states.creators.landingPage.preview.name,
            icon: 'fa fa-eye',
            color: 'pink'
          },
          {
            name: 'Edit Page',
            state: states.creators.landingPage.edit.name,
            icon: 'fa fa-pencil',
            color: 'pink'
          }
        ]
      },
      {
        separator: true
      },
      {
        name: 'Posts',
        state: states.creators.posts.name,
        icon: 'fa fa-file-text-o',
        color: 'orange',
        secondary:
        [
          {
            name: 'Live Now',
            state: states.creators.posts.live.name,
            icon: 'fa fa-file-text-o',
            color: 'pink'
          },
          {
            name: 'Scheduled',
            state: states.creators.posts.scheduled.list.name,
            icon: 'fa fa-clock-o',
            color: 'yellow'
          }
        ]
      },
      {
        name: 'Create Blog',
        state: states.creators.createBlog.name,
        icon: 'fa fa-asterisk',
        color: 'yellow'
      },
      {
        name: 'Collections',
        state: states.creators.collections.name,
        icon: 'fa fa-th',
        color: 'green',
        secondary:
          [
            {
              name: 'Collections',
              state: states.creators.collections.name,
              icon: 'fa fa-th',
              color: 'green'
            }
          ]
      },
      {
        name: 'Channels',
        state: states.creators.channels.name,
        icon: 'fa fa-check-square-o',
        color: 'green',
        secondary:
        [
          {
            name: 'Channels',
            state: states.creators.channels.name,
            icon: 'fa fa-check-square-o',
            color: 'green'
          }
        ]
      },
      { separator: true },
      {
        id: 'account',
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
