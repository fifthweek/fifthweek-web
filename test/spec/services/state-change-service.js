describe('state change service', function(){
  'use strict';

  var event;
  var toState;
  var toParams;

  var stateChangeAuthorizationService;
  var stateChangeRedirectionService;
  var stateChangeRequireSubscriptionService;
  var target;

  beforeEach(function(){
    event = jasmine.createSpyObj('event', ['preventDefault']);
    toState = {name: 'a.state'};
    toParams = {};

    stateChangeAuthorizationService = jasmine.createSpyObj('stateChangeAuthorizationService', [ 'isPermitted', 'redirectAwayIfRequired' ]);
    stateChangeRedirectionService = jasmine.createSpyObj('stateChangeRedirectionService', [ 'isPermitted', 'redirectAwayIfRequired' ]);
    stateChangeRequireSubscriptionService = jasmine.createSpyObj('stateChangeRequireSubscriptionService', [ 'isPermitted', 'redirectAwayIfRequired' ]);

    module('webApp');
    module(function($provide) {
      $provide.value('stateChangeAuthorizationService', stateChangeAuthorizationService);
      $provide.value('stateChangeRedirectionService', stateChangeRedirectionService);
      $provide.value('stateChangeRequireSubscriptionService', stateChangeRequireSubscriptionService);
    });

    inject(function($injector) {
      target = $injector.get('stateChangeService');
    });
  });

  describe('when determining access permission', function() {

    it('should pass if all composed services pass', function () {
      stateChangeAuthorizationService.isPermitted.and.returnValue(true);
      stateChangeRedirectionService.isPermitted.and.returnValue(true);
      stateChangeRequireSubscriptionService.isPermitted.and.returnValue(true);

      var result = target.isPermitted(toState);

      expect(result).toBe(true);
      expect(stateChangeAuthorizationService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeRedirectionService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeRequireSubscriptionService.isPermitted).toHaveBeenCalledWith(toState);
    });

    it('should fail if any composed services fail', function () {
      stateChangeAuthorizationService.isPermitted.and.returnValue(true);
      stateChangeRedirectionService.isPermitted.and.returnValue(false);
      stateChangeRequireSubscriptionService.isPermitted.and.returnValue(true);

      var result = target.isPermitted(toState);

      expect(result).toBe(false);
      expect(stateChangeAuthorizationService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeRedirectionService.isPermitted).toHaveBeenCalledWith(toState);
      expect(stateChangeRequireSubscriptionService.isPermitted).not.toHaveBeenCalled();
    });
  });

  describe('when routing', function() {

    it('should forward call to all composed services', function () {
      target.redirectAwayIfRequired(event, toState, toParams);

      expect(stateChangeAuthorizationService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
      expect(stateChangeRedirectionService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
      expect(stateChangeRequireSubscriptionService.redirectAwayIfRequired).toHaveBeenCalledWith(event, toState, toParams);
    });
  });
});
