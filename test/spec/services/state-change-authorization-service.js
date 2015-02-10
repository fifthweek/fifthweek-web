describe('state change authorization service', function () {
  'use strict';

  var toState;
  var event;
  var stateData;

  var authenticationService;
  var authorizationService;
  var calculatedStates;
  var $rootScope;
  var $state;
  var states;
  var authorizationServiceConstants;
  var target;

  beforeEach(function() {
    authenticationService = { currentUser: {}};
    authorizationService = {};
    calculatedStates = jasmine.createSpyObj('calculatedStates', ['getDefaultState']);
    stateData = { access: { loginRequired: false } };
    toState = { name: 'testState', data: stateData };
    event = {
      preventDefault: function(){}
    };

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('authorizationService', authorizationService);
      $provide.value('calculatedStates', calculatedStates);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      states = $injector.get('states');
      authorizationServiceConstants = $injector.get('authorizationServiceConstants');
      target = $injector.get('stateChangeAuthorizationService');
    });
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  describe('when determining access permission', function() {

    it('should pass if the page has no access requirements', function() {
      toState.data = undefined;

      var result = target.isPermitted(toState);

      expect(result).toBe(true);
    });

    it('should pass if the page has empty access requirements', function() {
      stateData.access = undefined;

      var result = target.isPermitted(toState);

      expect(result).toBe(true);
    });

    describe('when user needs to be unauthenticated', function() {
      it('should pass if the user is unauthenticated', function() {
        authenticationService.currentUser.authenticated = false;
        stateData.access.requireUnauthenticated = true;

        var result = target.isPermitted(toState);

        expect(result).toBe(true);
      });

      it('should fail if the user is authenticated', function() {
        authenticationService.currentUser.authenticated = true;
        stateData.access.requireUnauthenticated = true;

        var result = target.isPermitted(toState);

        expect(result).toBe(false);
      });
    });

    describe('when user does not need to be unauthenticated', function() {
      it('should pass if the user is authorized', function() {
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.authorized;
        };

        var result = target.isPermitted(toState);

        expect(result).toBe(true);
      });

      it('should fail if the user is unauthorized', function() {
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.notAuthorized;
        };

        var result = target.isPermitted(toState);

        expect(result).toBe(false);
      });

      it('should fail if a login is required', function() {
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.loginRequired;
        };

        var result = target.isPermitted(toState);

        expect(result).toBe(false);
      });
    });
  });

  describe('when routing', function() {

    it('should not alter the path if the page has no access requirements', function(){
      toState.data = undefined;
      target.redirectAwayIfRequired(event, toState);
    });

    it('should not alter the path if the page has empty access requirements', function(){
      stateData.access = undefined;
      target.redirectAwayIfRequired(event, toState);
    });

    describe('when user needs to be unauthenticated', function() {

      it('should not alter the path if the user is unauthenticated', function() {
        authenticationService.currentUser.authenticated = false;
        stateData.access.requireUnauthenticated = true;

        target.redirectAwayIfRequired(event, toState);
      });

      it('should redirect to default state if the user is authenticated', function() {
        var nextState = 'nextState';
        calculatedStates.getDefaultState.and.returnValue(nextState);
        authenticationService.currentUser.authenticated = true;
        stateData.access.requireUnauthenticated = true;

        $state.expectTransitionTo(nextState);
        target.redirectAwayIfRequired(event, toState);
      });
    });

    describe('when user does not need to be unauthenticated', function() {

      it('should not alter the path if the user is authorized', function(){
        stateData.access.requireAuthenticated = true;
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.authorized;
        };

        target.redirectAwayIfRequired(event, toState);
      });

      it('should redirect to the sign in page if login is required and then return to the original page', function(){
        stateData.access.requireAuthenticated = true;
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.loginRequired;
        };

        $state.expectTransitionTo(states.signIn.name);
        target.redirectAwayIfRequired(event, toState);

        $state.verifyNoOutstandingTransitions();
        $state.expectTransitionTo(toState.name);

        target.redirectAwayIfRequired(event, toState);
      });

      it('should redirect to the not authorized page if the user is not authorized', function(){

        stateData.access.requireAuthenticated = true;
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.notAuthorized;
        };

        $state.expectTransitionTo(states.notAuthorized.name);
        target.redirectAwayIfRequired(event, toState);
      });

      it('should not redirect if the user navigates to a non-secure page after initial redirection to sign in page', function(){

        stateData.access.requireAuthenticated = true;
        authorizationService.authorize = function(){
          return authorizationServiceConstants.authorizationResult.loginRequired;
        };

        $state.expectTransitionTo(states.signIn.name);

        target.redirectAwayIfRequired(event, toState);

        $state.verifyNoOutstandingTransitions();

        stateData.access.requireAuthenticated = false;

        target.redirectAwayIfRequired(event, toState);
      });
    });
  });
});
