angular.module('webApp').constant('navigationOrchestratorConstants', {
  navigationChangedEvent: 'navigationChanged'
}).factory('navigationOrchestrator',
  function($rootScope, authenticationService, authenticationServiceConstants, $state, states, navigationOrchestratorConstants, uiRouterConstants) {
    'use strict';

    var primaryNavigation = [];
    var secondaryNavigation = [];

    var selectedPrimaryNavigation = undefined;
    var selectedSecondaryNavigation = undefined;

    var service = {};

    var getCurrentUserName = function(){
      return authenticationService.currentUser.username;
    };

    var navigationMap = [
      {
        name: 'Register',
        state: states.register.name,
        icon: 'fa fa-ticket',
        color: 'pink',
        showIf: function(data) { return !data.authenticated; }
      },
      {
        name: 'Sign In',
        state: states.signIn.name,
        icon: 'fa fa-sign-in',
        color: 'green',
        showIf: function(data) { return !data.authenticated; }
      },
      {
        name: getCurrentUserName,
        state: states.account.name,
        icon: 'fa fa-user',
        color: undefined,
        showIf: function(data) { return data.authenticated; },
        secondary: [
          {
            name: 'Account',
            state: states.account.name,
            icon: undefined,
            color: undefined
          },
          {
            name: 'Sign Out',
            state: states.signOut.name,
            icon: 'fa fa-ticket',
            color: 'pink'
          }
        ]
      },
      {
        separator: true,
        showIf: function(data) { return data.authenticated; }
      },
      {
        name: 'Dashboard',
        state: states.dashboard.demo.name,
        icon: 'fa fa-folder-open-o',
        color: undefined,
        showIf: function(data) { return data.authenticated; },
        secondary: [
          {
            name: 'Quick Demo',
            state: states.dashboard.demo.name,
            icon: 'fa fa-youtube-play',
            color: 'pink'
          },
          {
            name: 'Provide Feedback',
            state: states.dashboard.feedback.name,
            icon: 'fa fa-comment-o',
            color: 'yellow'
          }
        ]
      },
      {
        name: 'Create Your Subscription',
        state: states.creators.createSubscription.name,
        icon: 'fa fa-asterisk',
        color: 'yellow',
        showIf: function(data) { return data.authenticated && !data.hasSubscription; }
      },
      {
        name: 'Customize',
        state: states.creators.customize.landingPage.name,
        icon: 'fa fa-eye',
        color: undefined,
        showIf: function(data) { return data.authenticated; },
        secondary: [
          {
            name: 'Landing Page',
            state: states.creators.customize.landingPage.name,
            icon: 'fa fa-arrow-circle-down',
            color: 'pink'
          },
          {
            name: 'Collections',
            state: states.creators.customize.collections.name,
            icon: 'fa fa-th',
            color: 'pink'
          },
          {
            name: 'Channels',
            state: states.creators.customize.channels.name,
            icon: 'fa fa-list-alt',
            color: 'pink'
          }
        ]
      },
      { separator: true },
      {
        name: 'Help',
        state: states.help.faq.name,
        icon: 'fa fa-question-circle',
        color: undefined,
        secondary: [
          {
            name: 'FAQ',
            state: states.help.faq.name,
            icon: 'fa fa-book',
            color: 'blue'
          }
        ]
      }
    ];

    var broadcastCurrentUserChangedEvent = function(){
      $rootScope.$broadcast(navigationOrchestratorConstants.navigationChangedEvent, primaryNavigation, secondaryNavigation);
    };

    var functionExists = function(value){
      return typeof value === 'function';
    };

    var executeOrReturn = function(value){
      if(typeof value === 'function'){
        return value();
      }

      return value;
    };

    var shouldShow = function(updateData, item){
      var show = true;
      if(functionExists(item.showIf)){
        show = item.showIf(updateData);
      }
      return show;
    };

    var createOutputNavigationItem = function(inputItem, isActive){
      /*
      var outputItem = Object.create({}, {
        separator: { value: inputItem.separator },
        name: { value: executeOrReturn(inputItem.name) },
        state: { value: inputItem.state },
        icon: { value: inputItem.icon },
        color: { value: inputItem.color },
        isActive: { value: isActive }
      });
      */
      var outputItem = {
        separator: inputItem.separator,
        name: executeOrReturn(inputItem.name),
        state: inputItem.state,
        icon: inputItem.icon,
        color: inputItem.color,
        isActive: isActive
      };

      return outputItem;
    };

    var updateSecondaryNavigation = function(updateData, values) {
      if (values === undefined || values.length === 0) {
        selectedSecondaryNavigation = undefined;
        service.secondaryNavigation = [];
        return;
      }

      var newSecondaryNavigation = [];
      for (var i = 0; i < values.length; i++) {
        var item = values[i];

        if (shouldShow(updateData, item)) {
          var output = createOutputNavigationItem(item, item === selectedSecondaryNavigation);
          newSecondaryNavigation.push(output);
        }
      }

      return newSecondaryNavigation;
    };

    var updateNavigation = function(){
      var updateData = {
        authenticated: authenticationService.currentUser.authenticated,
        hasSubscription: false
      };

      var newPrimaryNavigation = [];
      var newSecondaryNavigation = [];
      for(var i = 0; i < navigationMap.length; i++){
        var item = navigationMap[i];

        if(shouldShow(updateData, item)){
          var output = createOutputNavigationItem(item, item === selectedPrimaryNavigation);
          newPrimaryNavigation.push(output);

          if(output.isActive){
            newSecondaryNavigation = updateSecondaryNavigation(updateData, item.secondary);
          }
        }
      }

      primaryNavigation = newPrimaryNavigation;
      secondaryNavigation = newSecondaryNavigation;
      broadcastCurrentUserChangedEvent();
    };

    var setSelectedNavigationFromState = function (state) {
      for (var primaryIndex = 0; primaryIndex < navigationMap.length; primaryIndex++) {
        var primaryItem = navigationMap[primaryIndex];

        var secondaryItems = primaryItem.secondary;
        if (secondaryItems) {
          for (var secondaryIndex = 0; secondaryIndex < secondaryItems.length; secondaryIndex++) {
            var secondaryItem = secondaryItems[secondaryIndex];

            if (secondaryItem.state === state) {
              selectedPrimaryNavigation = primaryItem;
              selectedSecondaryNavigation = secondaryItem;
              return;
            }
          }
        }

        if(primaryItem.state === state){
          selectedPrimaryNavigation = primaryItem;
          selectedSecondaryNavigation = undefined;
          return;
        }
      }

      selectedPrimaryNavigation = undefined;
      selectedSecondaryNavigation = undefined;
    };

    service.initialize = function(){
      $rootScope.$on(uiRouterConstants.stateChangeSuccessEvent, function(event, toState) {
        setSelectedNavigationFromState(toState.name);
        updateNavigation();
      });
      $rootScope.$on(authenticationServiceConstants.currentUserChangedEvent, function() {
        updateNavigation();
      });

      setSelectedNavigationFromState($state.current.name);
      updateNavigation();
    };

    return service;
  });
