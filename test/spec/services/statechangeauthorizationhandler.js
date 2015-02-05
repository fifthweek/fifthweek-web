describe('state change authorization handler', function () {
  'use strict';

  describe('when routing', function() {

    it('should not alter the path if the page has no access requirements', function(){
      toState.data = undefined;
      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should not alter the path if the page has empty access requirements', function(){
      stateData.access = undefined;
      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should not alter the path if the user is authorized', function(){
      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.authorized;
      };

      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should redirect to the sign in page if login is required and then return to the original page', function(){
      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };

      $state.expectTransitionTo(states.signIn.name);
      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);

      $state.verifyNoOutstandingTransitions();
      $state.expectTransitionTo(toState.name);

      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should redirect to the not authorized page if the user is not authorized', function(){

      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.notAuthorized;
      };

      $state.expectTransitionTo(states.notAuthorized.name);
      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should not redirect if the user navigates to a non-secure page after initial redirection to sign in page', function(){

      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };

      $state.expectTransitionTo(states.signIn.name);

      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);

      $state.verifyNoOutstandingTransitions();

      stateData.access.loginRequired = false;

      stateChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    var toState;
    var event;
    var stateData;

    beforeEach(function(){
      stateData = { access: { loginRequired: false } };
      toState = { name: 'testState', data: stateData };

      event = {
        preventDefault: function(){}
      };

    });
  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var authorizationService;
  var stateChangeAuthorizationHandler;
  var $rootScope;
  var $state;
  var states;
  var authorizationServiceConstants;

  beforeEach(function() {
    authorizationService = {};

    module(function($provide) {
      $provide.value('authorizationService', authorizationService);
    });
  });

  beforeEach(inject(function($injector) {
    stateChangeAuthorizationHandler = $injector.get('stateChangeAuthorizationHandler');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    states = $injector.get('states');
    authorizationServiceConstants = $injector.get('authorizationServiceConstants');
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });
});
