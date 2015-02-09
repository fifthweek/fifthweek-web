'use strict';

describe('sign in controller', function() {

  var error = 'error';
  var errorMessage = 'errorMessage';
  var nextState = 'nextState';

  var $rootScope;
  var $state;
  var scope;
  var $q;
  var authenticationService;
  var calculatedStates;
  var logService;
  var utilities;
  var target;

  // Initialize the controller and a mock scope
  beforeEach(function() {
    authenticationService = jasmine.createSpyObj('authenticationService', ['signIn']);
    calculatedStates = jasmine.createSpyObj('calculatedStates', ['getDefaultState']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('logService', logService);
      $provide.value('utilities', utilities);
    });

    inject(function($injector, $controller) {
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      $q = $injector.get('$q');
      scope = $rootScope.$new();
      target = $controller('SignInCtrl', { $scope: scope });
    });
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  it('should navigate to the dashboard on successful sign in', function() {
    authenticationService.signIn.and.returnValue($q.when());
    calculatedStates.getDefaultState.and.returnValue(nextState);

    $state.expectTransitionTo(nextState);

    scope.signIn();
    $rootScope.$apply();
  });

  it('should display an error message and log the error on unsuccessful sign in', function() {
    authenticationService.signIn.and.returnValue($q.reject(error));
    utilities.getFriendlyErrorMessage.and.returnValue(errorMessage);

    scope.signIn();
    $rootScope.$apply();

    expect(logService.error).toHaveBeenCalledWith(error);
    expect(utilities.getFriendlyErrorMessage).toHaveBeenCalledWith(error);
    expect(scope.message).toEqual(errorMessage);
  });
});
