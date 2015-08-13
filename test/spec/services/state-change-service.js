describe('state change service', function(){
  'use strict';

  var event;
  var toState;
  var toParams;

  var stateChangeAuthorizationService;
  var stateChangeRedirectionService;
  var stateChangeRequireBlogService;
  var target;

  beforeEach(function(){
    event = jasmine.createSpyObj('event', ['preventDefault']);
    toState = {name: 'a.state'};
    toParams = {};

    stateChangeAuthorizationService = jasmine.createSpyObj('stateChangeAuthorizationService', [ 'isPermitted', 'redirectAwayIfRequired' ]);
    stateChangeRedirectionService = jasmine.createSpyObj('stateChangeRedirectionService', [ 'isPermitted', 'redirectAwayIfRequired' ]);
    stateChangeRequireBlogService = jasmine.createSpyObj('stateChangeRequireBlogService', [ 'isPermitted', 'redirectAwayIfRequired' ]);

    module('webApp');
    module(function($provide) {
      $provide.value('stateChangeAuthorizationService', stateChangeAuthorizationService);
      $provide.value('stateChangeRedirectionService', stateChangeRedirectionService);
      $provide.value('stateChangeRequireBlogService', stateChangeRequireBlogService);
    });

    inject(function($injector) {
      target = $injector.get('stateChangeService');
    });
  });

  describe('when determining access permission', function() {

    it('should pass if all composed services pass', function () {
      stateChangeRedirectionService.isPermitted.and.returnValue(true);
      stateChangeAuthorizationService.isPermitted.and.returnValue(true);
      stateChangeRequireBlogService.isPermitted.and.returnValue(true);

      var result = target.isPermitted(toState);

      expect(result).toBe(true);
      expect(stateChangeRedirectionService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeAuthorizationService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeRequireBlogService.isPermitted).toHaveBeenCalledWith(toState);
    });

    it('should fail if any composed services fail', function () {
      stateChangeRedirectionService.isPermitted.and.returnValue(true);
      stateChangeAuthorizationService.isPermitted.and.returnValue(false);
      stateChangeRequireBlogService.isPermitted.and.returnValue(true);

      var result = target.isPermitted(toState);

      expect(result).toBe(false);
      expect(stateChangeRedirectionService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeAuthorizationService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeRequireBlogService.isPermitted).not.toHaveBeenCalled();
    });
  });

  describe('when routing', function() {

    it('should forward call to all composed services', function () {
      target.redirectAwayIfRequired(event, toState, toParams);

      expect(stateChangeRedirectionService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
      expect(stateChangeAuthorizationService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
      expect(stateChangeRequireBlogService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
    });

    it('should stop forwarding if redirection occurs all composed services', function () {
      target.redirectAwayIfRequired(event, toState, toParams);

      stateChangeAuthorizationService.redirectAwayIfRequired.and.returnValue(true);
      expect(stateChangeRedirectionService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
      expect(stateChangeAuthorizationService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
      expect(stateChangeRequireBlogService.redirectAwayIfRequired).not.toHaveBeenCalledWith();
    });
  });
});
