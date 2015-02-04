describe('route change authorization handler', function () {
  'use strict';

  describe('when routing', function() {

    it('should not alter the path if the page has no access requirements', function(){
      routeChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should redirect to the sign in page if login is required and then return to the original page', function(){
      stateData.access = { loginRequired: true };
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };

      $state.expectTransitionTo(states.signIn.name);
      routeChangeAuthorizationHandler.handleStateChangeStart(event, toState);

      $state.verifyNoOutstandingTransitions();
      $state.expectTransitionTo(toState);

      routeChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should redirect to the not authorized page if the user is not authorized', function(){

      stateData.access = { loginRequired: true };
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.notAuthorized;
      };

      $state.expectTransitionTo(states.notAuthorized.name);
      routeChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    it('should not redirect if the user navigates to a non-secure page after initial redirection to sign in page', function(){

      stateData.access = { loginRequired: true };
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };

      $state.expectTransitionTo(states.signIn.name);

      routeChangeAuthorizationHandler.handleStateChangeStart(event, toState);

      $state.verifyNoOutstandingTransitions();

      stateData.access = { loginRequired: false };

      routeChangeAuthorizationHandler.handleStateChangeStart(event, toState);
    });

    var toState;
    var event;
    var stateData;

    beforeEach(function(){
      toState = 'testState';

      event = {
        preventDefault: function(){}
      };

      stateData = {};
      spyOn($state, 'get').and.returnValue(stateData);
    });
  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var authorizationService;
  var routeChangeAuthorizationHandler;
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
    routeChangeAuthorizationHandler = $injector.get('routeChangeAuthorizationHandler');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    states = $injector.get('states');
    authorizationServiceConstants = $injector.get('authorizationServiceConstants');
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });
});
