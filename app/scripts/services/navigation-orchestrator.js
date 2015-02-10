angular.module('webApp')
  .constant('navigationOrchestratorConstants', {
    navigationChangedEvent: 'navigationChanged'
  })
  .factory('navigationOrchestrator', function(navigationOrchestratorImpl){
    'use strict';
    navigationOrchestratorImpl.initialize();
    return navigationOrchestratorImpl;
  })
  .factory('navigationOrchestratorImpl',
  function($rootScope, navigationMap, stateChangeService, authenticationServiceConstants, $state, states, navigationOrchestratorConstants, uiRouterConstants) {
    'use strict';

    var primaryNavigation = [];
    var secondaryNavigation = [];

    var selectedPrimaryNavigation;
    var selectedSecondaryNavigation;

    var service = {};

    var broadcastNavigationChanged = function(){
      $rootScope.$broadcast(navigationOrchestratorConstants.navigationChangedEvent, primaryNavigation, secondaryNavigation);
    };

    var executeOrReturn = function(value){
      if(typeof value === 'function'){
        return value();
      }

      return value;
    };

    var shouldShow = function(item){
      var show = true;

      if(item.state !== undefined){
        return stateChangeService.isPermitted($state.get(item.state));
      }

      return show;
    };

    var createOutputNavigationItem = function(inputItem, isActive){
      var name = executeOrReturn(inputItem.name);
      var id = 'navigation-' + _.kebabCase(inputItem.id || name);

      return {
        separator: inputItem.separator,
        name: name,
        state: inputItem.state,
        icon: inputItem.icon,
        color: inputItem.color,
        isActive: isActive,
        id: id
      };
    };

    var updateSecondaryNavigation = function(values) {
      if (values === undefined || values.length === 0) {
        selectedSecondaryNavigation = undefined;
        service.secondaryNavigation = [];
        return [];
      }

      var newSecondaryNavigation = [];
      for (var i = 0; i < values.length; i++) {
        var item = values[i];

        if (shouldShow(item)) {
          var output = createOutputNavigationItem(item, item === selectedSecondaryNavigation);
          newSecondaryNavigation.push(output);
        }
      }

      return newSecondaryNavigation;
    };

    var updateNavigation = function(){
      var newPrimaryNavigation = [];
      var newSecondaryNavigation = [];
      for(var i = 0; i < navigationMap.length; i++){
        var item = navigationMap[i];

        if(shouldShow(item)){
          var output = createOutputNavigationItem(item, item === selectedPrimaryNavigation);

          if (output.separator) {
            if (newPrimaryNavigation.length > 0 && !_.last(newPrimaryNavigation).separator) {
              // Ensure we do not stack leading or multiple separators.
              newPrimaryNavigation.push(output);
            }
          }
          else {
            newPrimaryNavigation.push(output);
          }

          if(output.isActive){
            newSecondaryNavigation = updateSecondaryNavigation(item.secondary);
          }
        }
      }

      // Ensure we remove trailing separator
      if (newPrimaryNavigation.length > 0 && _.last(newPrimaryNavigation).separator) {
        newPrimaryNavigation.pop();
      }

      primaryNavigation = newPrimaryNavigation;
      secondaryNavigation = newSecondaryNavigation;
      broadcastNavigationChanged();
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

    service.getPrimaryNavigation = function(){
      return primaryNavigation;
    };

    service.getSecondaryNavigation = function(){
      return secondaryNavigation;
    };

    return service;
  });
