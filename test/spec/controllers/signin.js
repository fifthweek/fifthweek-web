'use strict';

describe('sign in controller', function() {

  var errorMessage = 'errorMessage';
  var nextState = 'nextState';

  var $rootScope;
  var $state;
  var scope;
  var $q;
  var authenticationService;
  var calculatedStates;
  var states;
  var logService;
  var utilities;
  var target;

  // Initialize the controller and a mock scope
  beforeEach(function() {
    calculatedStates = jasmine.createSpyObj('calculatedStates', ['getDefaultState']);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('calculatedStates', calculatedStates);
    });

    inject(function($controller, _$rootScope_, _$state_, _$q_) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $state = _$state_;
      $q = _$q_;

      authenticationService = {};
      logService = { error: function(){} };
      utilities = { getFriendlyErrorMessage: function(){ return errorMessage; } };

      target = $controller('SignInCtrl', {
        $scope: scope,
        $state: $state,
        authenticationService: authenticationService,
        logService: logService,
        utilities: utilities
      });
    })
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  it('should navigate to the dashboard on successful sign in', function() {
    calculatedStates.getDefaultState.and.returnValue(nextState);
    authenticationService.signIn = function() {
      var deferred = $q.defer();
      deferred.resolve('success');
      return deferred.promise;
    };

    $state.expectTransitionTo(nextState);

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
});
