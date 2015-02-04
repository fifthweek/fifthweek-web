'use strict';

describe('sign in controller', function() {

  it('should navigate to the dashboard on successful sign in', function() {
    authenticationService.signIn = function() {
      var deferred = $q.defer();
      deferred.resolve('success');
      return deferred.promise;
    };

    $state.expectTransitionTo(states.dashboard.demo.name);

    scope.signIn();
    $rootScope.$apply();
  });

  it('should display an error message and log the error on unsuccessful sign in', function() {
    authenticationService.signIn = function() {
      return $q.reject();
    };

    spyOn(logService, 'error');
    spyOn(utilities, 'getFriendlyErrorMessage').and.callThrough();

    scope.signIn();
    $rootScope.$apply();

    expect(logService.error).toHaveBeenCalled();
    expect(utilities.getFriendlyErrorMessage).toHaveBeenCalled();
    expect(scope.message).toEqual(errorMessage);
  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var SignInCtrl;
  var $rootScope;
  var $state;
  var scope;
  var $q;
  var authenticationService;
  var states;
  var logService;
  var utilities;
  var errorMessage = '!';

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$state_, _$q_, _states_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $state = _$state_;
    $q = _$q_;
    states = _states_;

    authenticationService = {};
    logService = { error: function(){} };
    utilities = { getFriendlyErrorMessage: function(){ return errorMessage; } };

    SignInCtrl = $controller('SignInCtrl', {
      $scope: scope,
      $state: $state,
      states: states,
      authenticationService: authenticationService,
      logService: logService,
      utilities: utilities
    });
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });
});
