'use strict';

describe('home controller', function() {
  var error = 'error';
  var errorMessage = 'errorMessage';
  var nextState = 'nextState';

  var $q;
  var $controller;

  var scope;
  var $state;
  var calculatedStates;
  var utilities;
  var $modal;
  var analytics;
  var authenticationService;
  var logService;
  var target;

  beforeEach(function() {
    calculatedStates = jasmine.createSpyObj('calculatedStates', [ 'getDefaultState' ]);
    $modal = {};
    analytics = jasmine.createSpyObj('analytics', ['eventTrack', 'setUserProperties']);
    authenticationService = jasmine.createSpyObj('utilities', ['signIn', 'registerUser']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    logService = jasmine.createSpyObj('logService', ['error']);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('$modal', $modal);
      $provide.value('analytics', analytics);
      $provide.value('authenticationService', authenticationService);
      $provide.value('utilities', utilities);
      $provide.value('logService', logService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope').$new();
      $state = $injector.get('$state');
    });

    // Satisfy the 'construction precondition' by default. There only needs to be
    // one test to ensure appropriate behaviour when this condition is not met.
    authenticationService.currentUser = { authenticated: false };

    initializeTarget();
  });

  // Split out since we have logic running in the constructor.
  function initializeTarget() {
    target = $controller('HomeCtrl', { $scope: scope });
  }

  describe('when the user is already authenticated', function(){
    it('should redirect to the dashboard page', function(){
      authenticationService.currentUser = { authenticated: true };
      calculatedStates.getDefaultState.and.returnValue(nextState);
      $state.expectTransitionTo(nextState);

      initializeTarget();

      $state.verifyNoOutstandingTransitions();
    });
  });

  describe('when the user is not authenticated', function(){

    it('should contain an openModal function', function(){
      expect(scope.openModal).toBeDefined();
    });

    it('should contain empty registration data on creation', function() {
      expect(scope.registrationData.email).toBe('');
      expect(scope.registrationData.username).toBe('');
      expect(scope.registrationData.password).toBe('');
    });

    describe('and submits the form', function() {

      beforeEach(function() {
        scope.registrationData = {
          email: 'lawrence@fifthweek.com',
          username: 'lawrence',
          password: 'password'
        };
      });

      it('should navigate to default state on successful registration', function() {
        calculatedStates.getDefaultState.and.returnValue(nextState);
        authenticationService.registerUser.and.returnValue($q.when());
        authenticationService.signIn.and.returnValue($q.when());

        $state.expectTransitionTo(nextState);

        scope.register();
        scope.$apply();

        expect(scope.message).toContain('Signing in...');
        expect(scope.submissionSucceeded).toBe(true);
      });

      it('should display an error message and log the error on unsuccessful registration', function() {
        utilities.getFriendlyErrorMessage.and.returnValue(errorMessage);
        authenticationService.registerUser = function() {
          var deferred = $q.defer();
          deferred.reject('Bad');
          return deferred.promise;
        };

        analytics.eventTrack = function(){};

        scope.register();
        scope.$apply();

        expect(logService.error).toHaveBeenCalled();
        expect(utilities.getFriendlyErrorMessage).toHaveBeenCalled();
        expect(scope.message).toEqual(errorMessage);
        expect(scope.submissionSucceeded).toBe(false);
      });

      it('should track registration attempts before communicating with the authentication service', function() {
        calculatedStates.getDefaultState.and.returnValue(nextState);
        var callSequence = [];

        authenticationService.signIn.and.returnValue($q.when());
        analytics.eventTrack = function(key, properties){
          callSequence.push(['analytics.eventTrack', key, properties]);
        };
        analytics.setUserProperties = function(){
          callSequence.push('analytics.setUserProperties');
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return $q.when();
        };

        $state.expectTransitionTo(nextState);

        scope.register();
        scope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Registration submitted', 'Registration'],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration succeeded', 'Registration']
        ]);
      });

      it('should track unsuccessful registrations', function() {
        var callSequence = [];
        authenticationService.signIn.and.returnValue($q.when());
        analytics.eventTrack = function(key, properties){
          callSequence.push(['analytics.eventTrack', key, properties]);
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return $q.reject(new ApiError('bad'));
        };

        scope.register();
        scope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Registration submitted', 'Registration'],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration failed', 'Registration']
        ]);
      });

      it('should track successful registrations', function() {
        calculatedStates.getDefaultState.and.returnValue(nextState);
        var callSequence = [];

        authenticationService.signIn = function() {
          return $q.when();
        };
        analytics.eventTrack = function(key, properties){
          callSequence.push(['analytics.eventTrack', key, properties]);
        };
        analytics.setUserProperties = function(userProperties){
          callSequence.push(['analytics.setUserProperties', userProperties]);
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return $q.when();
        };

        $state.expectTransitionTo(nextState);

        scope.register();
        scope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Registration submitted', 'Registration'],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration succeeded', 'Registration']
        ]);
      });
    });
  });
});
