angular.module('webApp')
  .factory('navigationMap', function(authenticationService, states) {
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
      //{
      //  name: function() { return authenticationService.currentUser.username; },
      //  id: 'Username',
      //  state: states.creators.newsfeed.name,
      //  icon: 'fa fa-user',
      //  color: 'pink'
      //},
      //{
      //  separator: true
      //},
      {
        name: 'Create Your Subscription',
        state: states.creators.createSubscription.name,
        icon: 'fa fa-asterisk',
        color: 'yellow'
      },
      {
        name: 'New Post',
        state: states.creators.compose.note.name,
        icon: 'fa fa-pencil-square-o',
        color: 'orange',
        secondary:
        [
          {
            name: 'Note',
            state: states.creators.compose.note.name,
            icon: 'fa fa-quote-left',
            color: 'orange'
          },
          {
            name: 'Image',
            state: states.creators.compose.image.name,
            icon: 'fa fa-image',
            color: 'orange'
          },
          {
            name: 'File',
            state: states.creators.compose.file.name,
            icon: 'fa fa-file-o',
            color: 'orange'
          }
        ]
      },
      {
        name: 'Backlog',
        state: states.creators.backlog.name,
        icon: 'fa fa-sort-amount-desc',
        color: 'yellow'
      },
      {
        name: 'Customize',
        state: states.creators.customize.landingPage.name,
        icon: 'fa fa-eye',
        color: 'green',
        secondary:
        [
          {
            name: 'Landing Page',
            state: states.creators.customize.landingPage.name,
            icon: 'fa fa-arrow-circle-down',
            color: 'green'
          },
          {
            name: 'Channels',
            state: states.creators.customize.channels.name,
            icon: 'fa fa-list-alt',
            color: 'green'
          },
          {
            name: 'Collections',
            state: states.creators.customize.collections.name,
            icon: 'fa fa-th',
            color: 'green'
          }
        ]
      },
      { separator: true },
      {
        name: 'Settings',
        state: states.account.name,
        icon: 'fa fa-cog',
        color: 'blue',
        secondary:
          [
            {
              name: 'Account',
              state: states.account.name,
              icon: 'fa fa-child',
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
