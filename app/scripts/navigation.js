angular.module('webApp')
  .factory('navigationMap', function(aggregateUserStateUtilities, states) {
    'use strict';

    return [
      {
        name: 'Register',
        state: states.home.name,
        icon: 'fa fa-ticket'
      },
      {
        name: 'Sign In',
        state: states.signIn.name,
        icon: 'fa fa-sign-in'
      },
      {
        name: 'Home',
        state: states.user.newsFeed.name,
        icon: 'fa fa-home',
        secondary:
        [
          {
            name: 'News Feed',
            state: states.user.newsFeed.name,
            icon: 'fa fa-align-left'
          },
          {
            name: 'Notifications',
            state: states.user.notifications.name,
            icon: 'fa fa-bell-o'
          }
        ]
      },
      {
        name: 'Landing Page',
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
        separator: true
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
              name: 'Sign Out',
              state: states.user.signOut.name,
              icon: 'fa fa-sign-out'
            }
          ]
      },
      {
        name: 'Help',
        state: states.help.name,
        icon: 'fa fa-question-circle',
        secondary:
        [
          {
            name: 'About Us',
            state: states.help.about.name,
            icon: 'fa fa-question-circle'
          },
          {
            name: 'FAQ',
            state: states.help.faq.name,
            icon: 'fa fa-book'
          },
          {
            name: 'Contact Us',
            state: states.help.contact.name,
            icon: 'fa fa-comment-o'
          },
          {
            name: 'Legal',
            state: states.help.legal.name,
            icon: 'fa fa-files-o'
          }
        ]
      }
    ];
  });
