describe('state-navigation-visibility directive', function(){
  'use strict';

  beforeEach(function() {
    module('webApp');
  });

  var $state;

  beforeEach(function() {
    $state = {};

    module(function($provide){
      $provide.value('$state', $state);
    });
  });

  var $rootScope;
  var $compile;
  var uiRouterConstants;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    uiRouterConstants = $injector.get('uiRouterConstants');
  }));

  describe('when created', function(){

    var scope;
    var state;

    beforeEach(function(){
      scope = $rootScope.$new();
      state = {data: {}};
      $state.current = state;
    });

    it('should check the current state and enable sidebar if required', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-navigation-visibility-from-state class="navigation-hidden"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should check the current state and enable sidebar if not specified', function(){
      var element = angular.element('<span fw-set-navigation-visibility-from-state class="navigation-hidden"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should check the current state and disable the sidebar if required', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should check the current state and disable the sidebar if required', function(){
      state.data.navigationHidden = 'header';

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);
    });

    it('should check attach to the $stateChangeSuccess event', function(){

      spyOn(scope, '$on');

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(scope.$on.calls.count()).toBe(1);
      expect(scope.$on.calls.first().args[0]).toBe(uiRouterConstants.stateChangeSuccessEvent);
    });
  });

  describe('when state changes', function(){

    var scope;
    var state;

    beforeEach(function(){
      scope = $rootScope.$new();
      state = {data: {}};
      $state.current = state;
    });

    it('should keep the sidebar enabled if required by both states', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);

      var toState = {data: {navigationHidden: false}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should disable the sidebar if required', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);

      var toState = {data: {navigationHidden: true}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should disable the header bar if required', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);

      var toState = {data: {navigationHidden: 'header'}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);
    });

    it('should enable the sidebar if required', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);

      var toState = {data: {navigationHidden: false}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should keep the sidebar disabled if required by both states', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);

      var toState = {data: {navigationHidden: true}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should keep the move between navigation hidden and header bar hidden', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);

      var toState = {data: {navigationHidden: 'header'}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);
    });

    it('should keep header bar hidden', function(){
      state.data.navigationHidden = 'header';

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);

      var toState = {data: {navigationHidden: 'header'}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);
    });

    it('should move between header bar hidden and navigation hidden', function(){
      state.data.navigationHidden = 'header';

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);

      var toState = {data: {navigationHidden: true}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(true);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });

    it('should move between header bar hidden and navigation enabled', function(){
      state.data.navigationHidden = 'header';

      var element = angular.element('<span fw-set-navigation-visibility-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(true);

      var toState = {data: {navigationHidden: false}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBe(false);
      expect(element.hasClass('navigation-header-hidden')).toBe(false);
    });
  });
});
