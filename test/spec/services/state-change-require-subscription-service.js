describe('state change require blog service', function(){
  'use strict';

  var nextState = 'nextState';

  var event;
  var toState;
  var toParams;

  var calculatedStates;
  var blogService;
  var $state;
  var target;

  beforeEach(function(){
    event = jasmine.createSpyObj('event', ['preventDefault']);
    toState = {name: 'a.state'};
    toParams = {};

    calculatedStates = jasmine.createSpyObj('calculatedStates', [ 'getDefaultState' ]);
    blogService = {};

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('blogService', blogService);
    });

    inject(function($injector) {
      $state = $injector.get('$state');
      target = $injector.get('stateChangeRequireBlogService');
    });
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  describe('when determining access permission', function() {

    it('should pass if the "requireBlog" field is not present', function () {
      var result = target.isPermitted(toState);

      expect(result).toBe(true);
    });

    it('should pass if the flag matches the service response', function () {
      toState.requireBlog = true;
      blogService.hasBlog = true;

      var result = target.isPermitted(toState);

      expect(result).toBe(true);
    });

    it('should fail if the flag is true and service returns false', function () {
      toState.requireBlog = true;
      blogService.hasBlog = false;

      var result = target.isPermitted(toState);

      expect(result).toBe(false);
    });

    it('should fail if the flag is false and service returns true', function () {
      toState.requireBlog = false;
      blogService.hasBlog = true;

      var result = target.isPermitted(toState);

      expect(result).toBe(false);
    });
  });

  describe('when routing', function() {

    it('should not do anything if the "requireBlog" field is not present', function () {
      target.redirectAwayIfRequired(event, toState, toParams);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should redirect to the default state if the flag is true and service returns false', function () {
      toState.requireBlog = true;
      blogService.hasBlog = false;
      calculatedStates.getDefaultState.and.returnValue(nextState);

      $state.expectTransitionTo(nextState);

      target.redirectAwayIfRequired(event, toState, toParams);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should redirect to the default state if the flag is false and service returns true', function () {
      toState.requireBlog = false;
      blogService.hasBlog = true;
      calculatedStates.getDefaultState.and.returnValue(nextState);

      $state.expectTransitionTo(nextState);

      target.redirectAwayIfRequired(event, toState, toParams);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
