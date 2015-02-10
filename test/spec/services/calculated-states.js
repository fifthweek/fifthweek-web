describe('ui state provider', function() {
  'use strict';

  var $q;
  var states;
  var subscriptionService;
  var authenticationService;
  var authenticationServiceConstants;
  var target;

  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      subscriptionService = {};
      authenticationService = { currentUser: {}};

      $provide.value('subscriptionService', subscriptionService);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      states = $injector.get('states');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
      target = $injector.get('calculatedStates');
    });
  });

  describe('when calculating default state', function() {

    it('it should return "home" for unauthenticated users', function() {
      authenticationService.currentUser.authenticated = false;

      var result = target.getDefaultState();

      expect(result).toBe(states.home.name);
    });

    it('it should return "dashboard demo" for non-creators', function() {
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = [];

      var result = target.getDefaultState();

      expect(result).toBe(states.dashboard.demo.name);
    });

    it('it should return "create your subscription" for creators without a subscription', function() {
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = [ authenticationServiceConstants.roles.creator ];
      subscriptionService.hasSubscription = false;

      var result = target.getDefaultState();

      expect(result).toBe(states.creators.createSubscription.name);
    });

    it('it should return "dashboard demo" for creators with a subscription', function() {
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = [ authenticationServiceConstants.roles.creator ];
      subscriptionService.hasSubscription = true;

      var result = target.getDefaultState();

      expect(result).toBe(states.dashboard.demo.name);
    });
  });
});
