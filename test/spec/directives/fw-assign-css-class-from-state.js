describe('fw-assign-css-class-from-state directive', function(){
  'use strict';

  describe('when created', function(){

    it('should check the current state and add the body class if present', function(){
      state.data.bodyClass = 'page-test';

      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('page-test')).toBeTruthy();
    });

    it('should check the current state and add the body class if present', function(){
      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.className).toBeUndefined();
    });

    it('should check attach to the $stateChangeSuccess event', function(){

      spyOn(scope, '$on');

      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(scope.$on.calls.count()).toBe(1);
      expect(scope.$on.calls.first().args[0]).toBe('$stateChangeSuccess');
    });

    it('should detach from $stateChangeSuccess when destroyed', function(){

      var detached = false;
      spyOn(scope, '$on').and.returnValue(function(){detached = true;});

      var element = angular.element('<span fw-assign-css-class-from-state />');

      $compile(element)(scope);
      scope.$digest();

      expect(detached).toBeFalsy();

      element.remove();

      expect(detached).toBeTruthy();
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

    it('should add the new class if specified', function(){
      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      var toState = {data: {bodyClass: 'new-class'}};
      var fromState = state;
      scope.$broadcast('$stateChangeSuccess', toState, undefined, fromState);

      expect(element.hasClass('new-class')).toBeTruthy();
    });

    it('should replace the existing class with new class if specified', function(){
      state.data.bodyClass = 'old-class';

      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('old-class')).toBeTruthy();
      expect(element.hasClass('new-class')).toBeFalsy();

      var toState = {data: {bodyClass: 'new-class'}};
      var fromState = state;
      scope.$broadcast('$stateChangeSuccess', toState, undefined, fromState);

      expect(element.hasClass('old-class')).toBeFalsy();
      expect(element.hasClass('new-class')).toBeTruthy();
    });

    it('should remove the existing class if no new class specified', function(){
      state.data.bodyClass = 'old-class';

      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('old-class')).toBeTruthy();

      var toState = {data: {}};
      var fromState = state;
      scope.$broadcast('$stateChangeSuccess', toState, undefined, fromState);

      expect(element.hasClass('old-class')).toBeFalsy();
      expect(element.className).toBeUndefined();
    });

    it('should do nothing if neither old nor new states specified a class', function(){
      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.className).toBeUndefined();

      var toState = {data: {}};
      var fromState = state;
      scope.$broadcast('$stateChangeSuccess', toState, undefined, fromState);

      expect(element.className).toBeUndefined();
    });

    it('should do nothing if both new and old states specify the same class', function(){
      state.data.bodyClass = 'some-class';

      var element = angular.element('<span fw-assign-css-class-from-state />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.hasClass('some-class')).toBeTruthy();

      var toState = {data: {bodyClass: 'some-class'}};
      var fromState = state;
      scope.$broadcast('$stateChangeSuccess', toState, undefined, fromState);

      expect(element.hasClass('some-class')).toBeTruthy();
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

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  }));
});
