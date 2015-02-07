describe('navigation orchestrator', function(){
  'use strict';

  beforeEach(module('webApp', 'stateMock'));

  var target;

  var $rootScope;
  var $state;
  var states;
  var authenticationServiceConstants;
  var navigationOrchestratorConstants;
  var authenticationService;
  var uiRouterConstants;

  beforeEach(function() {
    authenticationService = {
      currentUser: { userId: undefined }
    };

    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
    });
  });

  beforeEach(inject(function($injector) {
    target = $injector.get('navigationOrchestrator');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    states = $injector.get('states');
    authenticationServiceConstants = $injector.get('authenticationServiceConstants');
    navigationOrchestratorConstants = $injector.get('navigationOrchestratorConstants');
    uiRouterConstants = $injector.get('uiRouterConstants');
  }));

  beforeEach(function(){
    $state.current = {
      name: states.home.name
    }
  });

  it('should attach to the $stateChangeSuccess and currentUserChanged events when initialized', function(){
    spyOn($rootScope, '$on');

    target.initialize();

    expect($rootScope.$on.calls.count()).toBe(2);
    expect($rootScope.$on.calls.argsFor(0)[0]).toBe(uiRouterConstants.stateChangeSuccessEvent);
    expect($rootScope.$on.calls.argsFor(1)[0]).toBe(authenticationServiceConstants.currentUserChangedEvent);
  });

  it('should update navigation when initialized', function(){
    spyOn($rootScope, '$broadcast');

    target.initialize();

    expect($rootScope.$broadcast.calls.count()).toBe(1);
    expect($rootScope.$broadcast.calls.first().args[0]).toBe(navigationOrchestratorConstants.navigationChangedEvent);
    expect($rootScope.$broadcast.calls.first().args[1]).toBeDefined();
    expect($rootScope.$broadcast.calls.first().args[2]).toBeDefined();
  });

  describe('when updating navigation', function(){

    var primaryNavigation;
    var secondaryNavigation;

    beforeEach(function(){
      spyOn($rootScope, '$broadcast').and.callFake(function(event, newPrimaryNavigation, newSecondaryNavigation) {
        primaryNavigation = newPrimaryNavigation;
        secondaryNavigation = newSecondaryNavigation;
      });
    });

    it('should have no primary navigation selected if the state is not recognised', function(){
      $state.current.name = 'unknown.state';

      target.initialize();


    });

  });

  describe('when initialized', function(){

    beforeEach(function(){
      target.initialize();
    });

    it('should update navigation when the current user changes', function(){
      spyOn($rootScope, '$broadcast').and.callThrough();

      $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, {});

      expect($rootScope.$broadcast.calls.count()).toBe(2);
      expect($rootScope.$broadcast.calls.first().args[0]).toBe(authenticationServiceConstants.currentUserChangedEvent);
      expect($rootScope.$broadcast.calls.mostRecent().args[0]).toBe(navigationOrchestratorConstants.navigationChangedEvent);
      expect($rootScope.$broadcast.calls.mostRecent().args[1]).toBeDefined();
      expect($rootScope.$broadcast.calls.mostRecent().args[2]).toBeDefined();
    });

    it('should update navigation when the current state changes', function(){
      spyOn($rootScope, '$broadcast').and.callThrough();

      $rootScope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, {name: states.home.name});

      expect($rootScope.$broadcast.calls.count()).toBe(2);
      expect($rootScope.$broadcast.calls.first().args[0]).toBe(uiRouterConstants.stateChangeSuccessEvent);
      expect($rootScope.$broadcast.calls.mostRecent().args[0]).toBe(navigationOrchestratorConstants.navigationChangedEvent);
      expect($rootScope.$broadcast.calls.mostRecent().args[1]).toBeDefined();
      expect($rootScope.$broadcast.calls.mostRecent().args[2]).toBeDefined();
    });
  });
});
