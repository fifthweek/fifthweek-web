angular.module('webApp')
  .factory('navigationMap', function(aggregateUserStateUtilities, composeService, submitFeedbackService, states) {
    'use strict';

    return [
      {
        name: 'Home',
        hidden: true,
        state: states.home.name,
        secondary:
          [
            {
              name: 'Explore',
              state: states.home.name
            },
            {
              name: 'Pricing',
              state: states.pricing.name
            },
            {
              name: 'Getting Started',
              state: states.gettingStarted.name
            },
            {
              name: 'Contact',
              state: states.contact.name
            }
          ]
      },
      {
        name: 'Legal',
        hidden: true,
        state: states.legal.name,
        secondary:
          [
            {
              name: 'Terms of Service',
              state: states.legal.termsOfService.name
            },
            {
              name: 'Privacy Policy',
              state: states.legal.privacyPolicy.name
            }
          ]
      },
      {
        name: 'Sign In',
        state: states.signIn.signIn.name,
        icon: 'fa fa-sign-in'
      },
      {
        name: 'Register',
        state: states.register.name,
        icon: 'fa fa-asterisk'
      },
      {
        name: 'Latest Posts',
        state: states.user.newsFeed.name,
        icon: 'fa fa-bolt'
      },
      {
        name: 'Subscriptions',
        state: states.user.viewSubscriptions.name,
        icon: 'fa fa-check-circle'
      },
      {
        separator: true
      },
      {
        name: 'View Profile',
        state: states.creator.landingPage.preview.name,
        icon: 'fa fa-user'
      },
      {
        name: 'Edit Profile',
        state: states.creator.landingPage.edit.name,
        icon: 'fa fa-pencil',
        secondary:
          [
            {
              name: 'Profile Information',
              state: states.creator.landingPage.edit.name,
              icon: 'fa fa-pencil'
            },
            {
              name: 'Channels',
              state: states.creator.channels.name,
              icon: 'fa fa-check-square-o'
            }
          ]
      },
      {
        name: 'Subscribers',
        state: states.creator.subscribers.all.name,
        icon: 'fa fa-users'
      },
      {
        name: 'Guest List',
        state: states.creator.subscribers.guestList.name,
        icon: 'fa fa-street-view'
      },
      {
        separator: true
      },
      {
        name: 'Publish',
        state: states.user.creatorAccount.name,
        icon: 'fa fa-asterisk'
      },
      {
        name: 'Create Channel',
        state: states.creator.createBlog.name,
        icon: 'fa fa-asterisk'
      },
      {
        name: 'New Post',
        state: states.creator.posts.compose.name,
        action: composeService.compose,
        icon: 'fa fa-asterisk'
      },
      {
        name: 'Live Posts',
        state: states.creator.posts.live.name,
        icon: 'fa fa-calendar-check-o'
      },
      {
        name: 'Scheduled Posts',
        state: states.creator.posts.scheduled.list.name,
        icon: 'fa fa-calendar-o',
        secondary:
          [
            {
              name: 'Scheduled Posts',
              state: states.creator.posts.scheduled.list.name,
              icon: 'fa fa-calendar-o'
            },
            {
              name: 'Queues',
              state: states.creator.queues.name,
              icon: 'fa fa-th'
            }
          ]
      },
      {
        separator: true
      },
      {
        id: 'account',
        name: aggregateUserStateUtilities.getUsername,
        state: states.user.account.name,
        icon: 'fa fa-cog',
        secondary:
          [
            {
              name: 'Account Settings',
              state: states.user.account.name,
              icon: 'fa fa-cog'
            },
            {
              name: 'Payment',
              state: states.user.paymentInformation.name,
              icon: 'fa fa-credit-card'
            }
          ]
      },
      {
        name: 'Sign Out',
        state: states.user.signOut.name,
        icon: 'fa fa-sign-out'
      },
      {
        name: 'Help',
        state: states.help.name,
        icon: 'fa fa-question-circle'
      },
      {
        name: 'Send Feedback',
        state: states.user.feedback.name,
        action: submitFeedbackService.showDialog,
        icon: 'fa fa-comment-o'
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
            name: 'Creator Revenues',
            state: states.admin.creatorRevenues.name,
            icon: 'fa fa-money'
          }
        ]
      }
    ];
  });
