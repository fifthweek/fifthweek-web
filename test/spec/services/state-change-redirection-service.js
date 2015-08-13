describe('state change redirection service', function(){
  'use strict';

  var event;
  var toState;
  var toParams;

  var $state;
  var target;

  beforeEach(function(){
    event = { preventDefault: function(){} };
    toState = {name: 'a.state'};
    toParams = {};

    module('webApp', 'stateMock');

    inject(function($injector) {
      target = $injector.get('stateChangeRedirectionService');
      $state = $injector.get('$state');
    });
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  it('should pass access permission', function() {
    var result = target.isPermitted();

    expect(result).toBe(true);
  });

  it('should not do anything if the redirectTo field is not present', function(){

    spyOn(event, 'preventDefault');

    var result = target.redirectAwayIfRequired(event, toState,  toParams);

    expect(event.preventDefault).not.toHaveBeenCalled();

    expect(result).toBe(false);
  });

  it('should redirect if the redirectTo field is present', function(){

    toState.redirectTo = 'another.state';
    spyOn(event, 'preventDefault');

    $state.expectTransitionTo(toState.redirectTo);

    var result = target.redirectAwayIfRequired(event, toState,  toParams);

    expect(event.preventDefault).toHaveBeenCalled();

    expect(result).toBe(true);
  });
});
