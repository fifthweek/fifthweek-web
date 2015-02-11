describe('navigation orchestrator factory', function(){
  'use strict';

  var navigationOrchestratorImpl;
  var $injector;

  beforeEach(function(){
    navigationOrchestratorImpl = jasmine.createSpyObj('navigationOrchestratorImpl', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('navigationOrchestratorImpl', navigationOrchestratorImpl);
    });

    inject(function(_$injector_) {
      $injector = _$injector_;
    });
  });

  it('should initialize the authentication service', function(){
    var target = $injector.get('navigationOrchestrator');

    expect(target.initialize).toHaveBeenCalled();
  });

  it('should return the authentication service', function(){
    var target = $injector.get('navigationOrchestrator');

    expect(target).toBe(navigationOrchestratorImpl);
  });
});

describe('navigation orchestrator', function(){
  'use strict';

  var target;

  var $rootScope;
  var $state;
  var states;
  var stateChangeService;
  var authenticationServiceConstants;
  var aggregateUserStateConstants;
  var navigationOrchestratorConstants;
  var uiRouterConstants;

  var initializeTarget = function(navigationMap) {
    stateChangeService = jasmine.createSpyObj('stateChangeService', [ 'isPermitted' ]);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('navigationMap', navigationMap);
      $provide.value('stateChangeService', stateChangeService);
    });

    inject(function($injector) {
      target = $injector.get('navigationOrchestratorImpl');
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      states = $injector.get('states');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      navigationOrchestratorConstants = $injector.get('navigationOrchestratorConstants');
      uiRouterConstants = $injector.get('uiRouterConstants');
    });

    $state.current = {
      name: 'unknown.state'
    };
  };

  it('should attach to the state change events on initialization', function(){
    initializeTarget([]);
    spyOn($rootScope, '$on');

    target.initialize();

    expect($rootScope.$on.calls.count()).toBe(3);
    expect($rootScope.$on.calls.argsFor(0)[0]).toBe(uiRouterConstants.stateChangeSuccessEvent);
    expect($rootScope.$on.calls.argsFor(1)[0]).toBe(authenticationServiceConstants.currentUserChangedEvent);
    expect($rootScope.$on.calls.argsFor(2)[0]).toBe(aggregateUserStateConstants.updatedEvent);
  });

  it('should update navigation on initialization', function(){
    initializeTarget([]);
    spyOn($rootScope, '$broadcast');

    target.initialize();

    expect($rootScope.$broadcast.calls.count()).toBe(1);
    expect($rootScope.$broadcast.calls.first().args[0]).toBe(navigationOrchestratorConstants.navigationChangedEvent);
    expect($rootScope.$broadcast.calls.first().args[1]).toBeDefined();
    expect($rootScope.$broadcast.calls.first().args[2]).toBeDefined();
  });

  describe('when initialized', function(){

    beforeEach(function(){
      initializeTarget([]);
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

    it('should update navigation when the aggregate user state changes', function(){
      spyOn($rootScope, '$broadcast').and.callThrough();

      $rootScope.$broadcast(aggregateUserStateConstants.updatedEvent, {});

      expect($rootScope.$broadcast.calls.count()).toBe(2);
      expect($rootScope.$broadcast.calls.first().args[0]).toBe(aggregateUserStateConstants.updatedEvent);
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
    var unknownState = 'unknownState';
    var knownState = 'knownState';
    var parentOnlyState = 'parentOnlyState';
    var parentOnlyName = 'parentOnlyName';
    var parentState = 'parentState';
    var parentName = 'parentName';
    var childState = 'childState';
    var childName = 'childName';
    var basicNavigationMap = [
      {
        name: 'Page',
        state: knownState,
        icon: 'fa fa-ticket',
        color: 'pink'
      },
      {
        name: parentOnlyName,
        state: parentOnlyState,
        icon: 'fa fa-ticket',
        color: 'pink'
      },
      { separator: true },
      {
        name: 'Some Separated Page',
        state: 'SeparatedPage',
        icon: 'fa fa-ticket',
        color: 'pink'
      },
      { separator: true },
      {
        name: parentName,
        state: parentState,
        icon: 'fa fa-user',
        color: undefined,
        secondary:
          [
            {
              name: childName,
              state: childState,
              icon: 'fa fa-child',
              color: 'green'
            },
            {
              name: 'Secondary Page 2',
              state: childState + '2',
              icon: 'fa fa-ticket',
              color: 'pink'
            }
          ]
      }
    ];

    beforeEach(function(){
      initializeTarget(basicNavigationMap);

      spyOn($rootScope, '$broadcast').and.callFake(function(event, newPrimaryNavigation, newSecondaryNavigation) {
        primaryNavigation = newPrimaryNavigation;
        secondaryNavigation = newSecondaryNavigation;
      });

      $state.get = function(stateName) {
        return { name: stateName };
      };
    });

    it('should have no primary navigation selected if the state is not recognised', function(){
      $state.current.name = unknownState;

      target.initialize();

      expect(_.all(primaryNavigation, { 'isActive': false })).toBeTruthy();
    });

    it('should have no primary navigation selected if the state is filtered out of results', function(){
      stateChangeService.isPermitted = function(state) {
        return state.name !== knownState;
      };
      $state.current.name = knownState;

      target.initialize();

      expect(_.all(primaryNavigation, { 'isActive': false })).toBeTruthy();
    });

    it('should have a primary navigation selected but no secondary navigation if the state is primary', function(){
      stateChangeService.isPermitted = function() {
        return true;
      };
      $state.current.name = parentOnlyState;

      target.initialize();

      var primary = _.filter(primaryNavigation, 'isActive');
      expect(primary.length).toBe(1);
      expect(primary[0].name).toBe(parentOnlyName);
      expect(primary[0].isActive).toBe(true);
    });

    it('should have a primary and secondary navigation selected if the state is secondary', function(){
      stateChangeService.isPermitted = function() {
        return true;
      };
      $state.current.name = childState;

      target.initialize();

      var primary = _.filter(primaryNavigation, 'isActive');
      expect(primary.length).toBe(1);
      expect(primary[0].name).toBe(parentName);
      expect(primary[0].isActive).toBe(true);

      var secondary = secondaryNavigation;
      expect(secondary.length).toBe(2);
      expect(secondary[0].name).toBe(childName);
      expect(secondary[0].isActive).toBe(true);
      expect(secondary[1].isActive).toBe(false);
    });
  });
});
