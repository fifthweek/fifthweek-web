describe('state-sidebar-enablement directive', function(){
  'use strict';

  describe('when created', function(){

    it('should check the current state and enable sidebar if required', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-sidebar-enabled-from-state class="navigation-hidden"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeFalsy();
    });

    it('should check the current state and enable sidebar if not specified', function(){
      var element = angular.element('<span fw-set-sidebar-enabled-from-state class="navigation-hidden"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeFalsy();
    });

    it('should check the current state and disable the sidebar if required', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-sidebar-enabled-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeTruthy();
    });

    it('should check attach to the $stateChangeSuccess event', function(){

      spyOn(scope, '$on');

      var element = angular.element('<span fw-set-sidebar-enabled-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(scope.$on.calls.count()).toBe(1);
      expect(scope.$on.calls.first().args[0]).toBe(uiRouterConstants.stateChangeSuccessEvent);
    });

    var scope;
    var state;

    beforeEach(function(){
      scope = $rootScope.$new();
      state = {data: {}};
      $state.current = state;
    });
  });

  describe('when state changes', function(){

    it('should enable the sidebar if required', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-sidebar-enabled-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeTruthy();

      var toState = {data: {navigationHidden: false}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBeFalsy();
    });

    it('should disable the sidebar if required', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-sidebar-enabled-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeFalsy();

      var toState = {data: {navigationHidden: true}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBeTruthy();
    });

    it('should keep the sidebar enabled if required by both states', function(){
      state.data.navigationHidden = false;

      var element = angular.element('<span fw-set-sidebar-enabled-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeFalsy();

      var toState = {data: {navigationHidden: false}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBeFalsy();
    });

    it('should keep the sidebar disabled if required by both states', function(){
      state.data.navigationHidden = true;

      var element = angular.element('<span fw-set-sidebar-enabled-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('navigation-hidden')).toBeTruthy();

      var toState = {data: {navigationHidden: true}};
      var fromState = state;
      scope.$broadcast(uiRouterConstants.stateChangeSuccessEvent, toState, undefined, fromState);

      expect(element.hasClass('navigation-hidden')).toBeTruthy();
    });

    var scope;
    var state;

    beforeEach(function(){
      scope = $rootScope.$new();
      state = {data: {}};
      $state.current = state;
    });
  });


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
});
