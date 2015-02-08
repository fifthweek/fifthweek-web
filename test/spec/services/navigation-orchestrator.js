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
      currentUser: {
        authenticated: false,
        username: undefined
      }
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

  it('should attach to the $stateChangeSuccess and currentUserChanged events on initialization', function(){
    spyOn($rootScope, '$on');

    target.initialize();

    expect($rootScope.$on.calls.count()).toBe(2);
    expect($rootScope.$on.calls.argsFor(0)[0]).toBe(uiRouterConstants.stateChangeSuccessEvent);
    expect($rootScope.$on.calls.argsFor(1)[0]).toBe(authenticationServiceConstants.currentUserChangedEvent);
  });

  it('should update navigation on initialization', function(){
    spyOn($rootScope, '$broadcast');

    target.initialize();

    expect($rootScope.$broadcast.calls.count()).toBe(1);
    expect($rootScope.$broadcast.calls.first().args[0]).toBe(navigationOrchestratorConstants.navigationChangedEvent);
    expect($rootScope.$broadcast.calls.first().args[1]).toBeDefined();
    expect($rootScope.$broadcast.calls.first().args[2]).toBeDefined();
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

      expect(_.all(primaryNavigation, { 'isActive': false })).toBeTruthy();
    });

    it('should have no primary navigation selected if the state is filtered out of results', function(){
      $state.current.name = states.account.name;

      target.initialize();

      expect(_.all(primaryNavigation, { 'isActive': false })).toBeTruthy();
    });

    it('should have a primary navigation selected but no secondary navigation if the state is primary', function(){
      $state.current.name = states.register.name;

      target.initialize();

      var primary = _.filter(primaryNavigation, 'isActive');
      expect(primary.length).toBe(1);
      expect(primary[0].name).toBe('Register');
    });

    it('should have a primary and secondary navigation selected if the state is secondary', function(){
      $state.current.name = states.help.faq.name;

      target.initialize();

      var primary = _.filter(primaryNavigation, 'isActive');
      expect(primary.length).toBe(1);
      expect(primary[0].name).toBe('Help');

      var secondary = _.filter(secondaryNavigation, 'isActive');
      expect(secondary.length).toBe(1);
      expect(secondary[0].name).toBe('FAQ');
    });

    describe('when not authenticated', function(){

      var expectedPrimaryMenu;

      beforeEach(function(){
        expectedPrimaryMenu = [
          { name: 'Register', id: 'navigation-register' },
          { name: 'Sign In', id: 'navigation-sign-in' },
          { separator: true },
          { name: 'Help', id: 'navigation-help' }
        ];
      });

      it('should create the expected primary navigation when not authenticated without subscriptions', function(){
        target.initialize();

        expectMenu(primaryNavigation, expectedPrimaryMenu);
      });

      it('should create the expected navigation in "register" state', function(){
        $state.current.name = states.register.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Register');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          []);
      });

      it('should create the expected navigation in "signIn" state', function(){
        $state.current.name = states.signIn.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Sign In');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          []);
      });

      it('should create the expected navigation in "help.faq" state', function(){
        $state.current.name = states.help.faq.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Help');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'FAQ', isActive: true}
          ]);
      });

    });

    describe('when authenticated', function(){

      var expectedPrimaryMenu;

      beforeEach(function(){
        authenticationService.currentUser.authenticated = true;
        authenticationService.currentUser.username = 'captain-phil';

        expectedPrimaryMenu = [
          { name: authenticationService.currentUser.username, id: 'navigation-username' },
          { separator: true },
          { name: 'Dashboard', id: 'navigation-dashboard' },
          { name: 'Create Your Subscription', id: 'navigation-create-your-subscription' },
          { name: 'Customize', id: 'navigation-customize' },
          { separator: true },
          { name: 'Help', id: 'navigation-help' }
        ];
      });

      it('should create the expected primary navigation when authenticated without subscriptions', function(){
        target.initialize();

        expectMenu(primaryNavigation, expectedPrimaryMenu);
      });

      it('should create the expected navigation in "account" state', function(){
        $state.current.name = states.account.name;
        target.initialize();

        setActive(expectedPrimaryMenu, authenticationService.currentUser.username);
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Account', isActive: true },
            { name: 'Sign Out' }
          ]);
      });

      it('should create the expected navigation in "signOut" state', function(){
        $state.current.name = states.signOut.name;
        target.initialize();

        setActive(expectedPrimaryMenu, authenticationService.currentUser.username);
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Account' },
            { name: 'Sign Out', isActive: true }
          ]);
      });

      it('should create the expected navigation in "dashboard.demo" state', function(){
        $state.current.name = states.dashboard.demo.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Dashboard');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Quick Demo', isActive: true },
            { name: 'Provide Feedback' }
          ]);
      });

      it('should create the expected navigation in "dashboard.feedback" state', function(){
        $state.current.name = states.dashboard.feedback.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Dashboard');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Quick Demo' },
            { name: 'Provide Feedback', isActive: true }
          ]);
      });

      it('should create the expected navigation in "creators.createSubscription" state', function(){
        $state.current.name = states.creators.createSubscription.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Create Your Subscription');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          []);
      });

      it('should create the expected navigation in "creators.customize.landingPage" state', function(){
        $state.current.name = states.creators.customize.landingPage.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Customize');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Landing Page', isActive: true },
            { name: 'Collections' },
            { name: 'Channels' }
          ]);
      });

      it('should create the expected navigation in "creators.customize.collections" state', function(){
        $state.current.name = states.creators.customize.collections.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Customize');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Landing Page' },
            { name: 'Collections', isActive: true },
            { name: 'Channels' }
          ]);
      });

      it('should create the expected navigation in "creators.customize.channels" state', function(){
        $state.current.name = states.creators.customize.channels.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Customize');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'Landing Page' },
            { name: 'Collections' },
            { name: 'Channels', isActive: true }
          ]);
      });

      it('should create the expected navigation in "help.faq" state', function(){
        $state.current.name = states.help.faq.name;
        target.initialize();

        setActive(expectedPrimaryMenu, 'Help');
        expectMenu(primaryNavigation, expectedPrimaryMenu);

        expectMenu(
          secondaryNavigation,
          [
            { name: 'FAQ', isActive: true }
          ]);
      });
    });

    var setActive = function(menu, name){
      _.find(menu, { name: name }).isActive = true;
    }

    var matches = function(target, test){
      if(test === undefined){
        return target === undefined;
      }

      var matched = true;
      _.forIn(test,  function(value, key){
        if (!_.has(target, key)){
          matched = false;
          return false;
        }

        if(_.result(target,  key) !== _.result(test,  key))
        {
          matched = false;
          return false;
        }
      });

      return matched;
    };

    var expectMenu = function (menu, expected) {

      expect(menu).toBeDefined();

      if(_.any(expected, 'isActive')){
        // If we expect any menu items to be active, then make sure only one is active.
        expect(_.filter(menu, 'isActive').length).toBe(1);
      }
      else{
        // Otherwise ensure none are active.
        expect(_.filter(menu, 'isActive').length).toBe(0);
      }

      var errors = [];
      _.zip(menu, expected).forEach(function (value) {
        if (!matches(value[0], value[1])) {
          errors.push('MATCH FAILED. Expected "' + JSON.stringify(value[1]) + '" but got "' + JSON.stringify(value[0]) + '"');
        }
      });
      expect(errors).toEqual([]);
    };
  });
});
