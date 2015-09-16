describe('registration controller', function() {
  'use strict';

  var nextState = 'nextState';

  var $q;

  var scope;
  var $state;
  var calculatedStates;
  var $modal;
  var authenticationService;
  var target;

  beforeEach(function() {
    calculatedStates = jasmine.createSpyObj('calculatedStates', [ 'getDefaultState' ]);
    $modal = {};
    authenticationService = jasmine.createSpyObj('utilities', ['signIn', 'registerUser']);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('$modal', $modal);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope').$new();
      scope.form = {};
      $state = $injector.get('$state');
      target = $controller('RegisterCtrl', { $scope: scope });
    });

    // Satisfy the 'construction precondition' by default. There only needs to be
    // one test to ensure appropriate behaviour when this condition is not met.
    authenticationService.currentUser = { authenticated: false };

    initializeTarget();
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  // Split out since we have logic running in the constructor.
  function initializeTarget() {
  }

  it('should contain tracking data on creation', function() {
    expect(scope.tracking.eventCategory).toBe('Registration');
    expect(scope.tracking.eventTitle).toBe('Registered');
  });

  it('should contain empty registration data on creation', function() {
    expect(scope.registrationData.email).toBe('');
    expect(scope.registrationData.username).toBe('');
    expect(scope.registrationData.password).toBe('');
    expect(scope.registrationData.registerAsCreator).toBe(true);
  });

  describe('and submits the form', function() {

    beforeEach(function() {
      scope.registrationData = {
        email: 'lawrence@fifthweek.com',
        username: 'lawrence',
        password: 'password',
        registerAsCreator: 'registerAsCreator'
      };
    });

    it('should set registrationSucceeded to true when registration succeeds', function() {
      calculatedStates.getDefaultState.and.returnValue(nextState);
      authenticationService.registerUser.and.returnValue($q.when());

      var deferred = $q.defer();
      authenticationService.signIn.and.returnValue(deferred.promise);

      scope.register();
      scope.$apply();

      expect(authenticationService.registerUser).toHaveBeenCalledWith({
        email: 'lawrence@fifthweek.com',
        username: 'lawrence',
        password: 'password',
        registerAsCreator: 'registerAsCreator'
      });

      expect(scope.form.message).toContain('Signing in...');
      expect(scope.registrationSucceeded).toBe(true);
    });

    it('should navigate to default state on successful sign-in', function() {
      calculatedStates.getDefaultState.and.returnValue(nextState);
      authenticationService.registerUser.and.returnValue($q.when());
      authenticationService.signIn.and.returnValue($q.when());

      $state.expectTransitionTo(nextState);

      scope.register();
      scope.$apply();
    });

    it('should set registrationSucceeded to false and propagate error on failure', function() {
      calculatedStates.getDefaultState.and.returnValue(nextState);
      authenticationService.registerUser.and.returnValue($q.when());
      authenticationService.signIn.and.returnValue($q.reject('error'));

      var error;
      scope.register().catch(function(e){ error = e; });
      scope.$apply();

      expect(error).toBe('error');
      expect(scope.registrationSucceeded).toBe(false);
    });
  });
});
