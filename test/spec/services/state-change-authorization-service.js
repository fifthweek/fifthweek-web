describe('state change authorization service', function () {
  'use strict';

  var toState;
  var event;
  var stateData;

  var authorizationService;
  var $rootScope;
  var $state;
  var states;
  var authorizationServiceConstants;
  var target;

  beforeEach(function() {
    authorizationService = {};
    stateData = { access: { loginRequired: false } };
    toState = { name: 'testState', data: stateData };
    event = {
      preventDefault: function(){}
    };

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('authorizationService', authorizationService);
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

  describe('when routing', function() {

    it('should not alter the path if the page has no access requirements', function(){
      toState.data = undefined;
      target.redirectAwayIfRequired(event, toState);
    });

    it('should not alter the path if the page has empty access requirements', function(){
      stateData.access = undefined;
      target.redirectAwayIfRequired(event, toState);
    });

    it('should not alter the path if the user is authorized', function(){
      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.authorized;
      };

      target.redirectAwayIfRequired(event, toState);
    });

    it('should redirect to the sign in page if login is required and then return to the original page', function(){
      stateData.access.loginRequired = true;
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

      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.notAuthorized;
      };

      $state.expectTransitionTo(states.notAuthorized.name);
      target.redirectAwayIfRequired(event, toState);
    });

    it('should not redirect if the user navigates to a non-secure page after initial redirection to sign in page', function(){

      stateData.access.loginRequired = true;
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };

      $state.expectTransitionTo(states.signIn.name);

      target.redirectAwayIfRequired(event, toState);

      $state.verifyNoOutstandingTransitions();

      stateData.access.loginRequired = false;

      target.redirectAwayIfRequired(event, toState);
    });
  });
});
