describe('state change redirection handler', function(){
  'use strict';

  it('should not do anything if the redirectTo field is not present', function(){

    spyOn(event, 'preventDefault');

    stateChangeRedirectionHandler.handleStateChangeStart(event, toState,  toParams);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should redirect if the redirectTo field is present', function(){

    toState.redirectTo = 'another.state';
    spyOn(event, 'preventDefault');

    $state.expectTransitionTo(toState.redirectTo);

    stateChangeRedirectionHandler.handleStateChangeStart(event, toState,  toParams);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  var event;
  var toState;
  var toParams;

  beforeEach(function(){
    event = { preventDefault: function(){} };
    toState = {name: 'a.state'};
    toParams = {};
  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var stateChangeRedirectionHandler;
  var $state;

  beforeEach(inject(function($injector) {
    stateChangeRedirectionHandler = $injector.get('stateChangeRedirectionHandler');
    $state = $injector.get('$state');
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });
});
