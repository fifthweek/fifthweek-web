'use strict';

describe('header controller', function() {

  it('should add the authentication information to the scope', function() {
    expect(scope.currentUser).toBe(authenticationService.currentUser);
  });

  describe('when signOut called', function(){
    it('should redirect to signout page', function(){
      $state.expectTransitionTo(states.signOut.name);

      scope.signOut();
    });
  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var HeaderCtrl;
  var scope;
  var authenticationService;
  var $state;
  var states;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$state_, _states_) {
    scope = $rootScope.$new();
    $state = _$state_;
    states = _states_;

    authenticationService = function() {};
    authenticationService.currentUser = 'ABCD';

    HeaderCtrl = $controller('HeaderCtrl', {
      $scope: scope,
      $state: $state,
      states: states,
      authenticationService: authenticationService
    });
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });
});
