'use strict';

describe('sign in controller', function() {

  var nextState = 'nextState';

  var $rootScope;
  var $state;
  var scope;
  var $q;
  var authenticationService;
  var calculatedStates;
  var target;

  // Initialize the controller and a mock scope
  beforeEach(function() {
    authenticationService = jasmine.createSpyObj('authenticationService', ['signIn']);
    calculatedStates = jasmine.createSpyObj('calculatedStates', ['getDefaultState']);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('calculatedStates', calculatedStates);
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
});
