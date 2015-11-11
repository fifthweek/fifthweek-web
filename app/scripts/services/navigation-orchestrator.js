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
  function(
    $rootScope,
    navigationMap,
    stateChangeService,
    authenticationServiceConstants,
    aggregateUserStateConstants,
    navigationOrchestratorConstants,
    uiRouterConstants,
    $state) {
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
      if(item.state !== undefined){
        return stateChangeService.isPermitted($state.get(item.state));
      }

      return true;
    };

    var isHidden = function(item){
      return item.hidden;
    };

    var createOutputNavigationItem = function(inputItem, isActive){
      var name = executeOrReturn(inputItem.name);
      var id = 'navigation-' + _.kebabCase(inputItem.id || name);

      return {
        separator: inputItem.separator,
        name: name,
        state: inputItem.state,
        action: inputItem.action,
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
          else if(!isHidden(item)) {
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

    var setSelectedNavigationFromState = function() {
      for (var primaryIndex = 0; primaryIndex < navigationMap.length; primaryIndex++) {
        var primaryItem = navigationMap[primaryIndex];

        var secondaryItems = primaryItem.secondary;
        if (secondaryItems) {
          for (var secondaryIndex = 0; secondaryIndex < secondaryItems.length; secondaryIndex++) {
            var secondaryItem = secondaryItems[secondaryIndex];

            if ($state.includes(secondaryItem.state)) {
              selectedPrimaryNavigation = primaryItem;
              selectedSecondaryNavigation = secondaryItem;
              return;
            }
          }
        }

        if($state.includes(primaryItem.state)){
          selectedPrimaryNavigation = primaryItem;
          selectedSecondaryNavigation = undefined;
          return;
        }
      }

      selectedPrimaryNavigation = undefined;
      selectedSecondaryNavigation = undefined;
    };

    service.initialize = function(){
      $rootScope.$on(uiRouterConstants.stateChangeSuccessEvent, function() {
        setSelectedNavigationFromState();
        updateNavigation();
      });

      // We should really listen on some event raised by `stateChangeService` for this, as we're effectively
      // monitoring changes to the behaviour of `stateChangeService.isPermitted`. However, these would just proxy the
      // following events anyway, so it's far easier to just listen to these directly. Furthermore, given we use an
      // aggregate state service, it's unlikely that many more state services will be added in future.
      $rootScope.$on(authenticationServiceConstants.currentUserChangedEvent, function() {
        updateNavigation();
      });
      $rootScope.$on(aggregateUserStateConstants.updatedEvent, function() {
        updateNavigation();
      });

      setSelectedNavigationFromState();
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
