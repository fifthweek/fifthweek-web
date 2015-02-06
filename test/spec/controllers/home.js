'use strict';

describe('home controller', function() {
  var $q;
  var $controller;

  var scope;
  var $state;
  var states;
  var utilities;
  var $modal;
  var analytics;
  var authenticationService;
  var logService;
  var target;

  beforeEach(module('webApp', 'stateMock'));

  beforeEach(inject(function($injector) {
    $q = $injector.get('$q');
    $controller = $injector.get('$controller');

    scope = $injector.get('$rootScope').$new();
    $state = $injector.get('$state');
    states = $injector.get('states');
    utilities = $injector.get('utilities');
    $modal = {};
    analytics = {};
    authenticationService = {};
    logService = {};
  }));

  // Split out since we have logic running in the constructor.
  function initializeTarget() {
    target = $controller('HomeCtrl', {
      $scope: scope,
      $state: $state,
      states: states,
      utilities: utilities,
      $modal: $modal,
      analytics: analytics,
      authenticationService: authenticationService,
      logService: logService
    });
  }

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  describe('when the user is already authenticated', function(){
    it('should redirect to the dashboard page', function(){
      $state.expectTransitionTo(states.dashboard.demo.name);

      authenticationService.currentUser = { authenticated: true };
      initializeTarget();
    });
  });

  describe('modal with video', function(){
    beforeEach(function() {
      authenticationService.currentUser = { authenticated: false };
      initializeTarget();
    });

    it('should contain an openModal function', function(){
      expect(scope.openModal).toBeDefined();
    });
  });

  describe('when the user is not authenticated', function(){
    var errorMessage = '!';
    beforeEach(function() {
      authenticationService.currentUser = { authenticated: false };
      logService.error = function(){};
      utilities.getFriendlyErrorMessage = function(){ return errorMessage; };
      initializeTarget();
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

      it('should navigate to dashboard on successful registration', function() {
        authenticationService.registerUser = function() { return resolvedPromise(); };
        authenticationService.signIn = function() { return resolvedPromise(); };
        analytics.eventTrack = function(){};
        analytics.setUserProperties = function(){};

        $state.expectTransitionTo(states.dashboard.demo.name);

        scope.register();
        scope.$apply();

        expect(scope.message).toContain('Signing in...');
        expect(scope.submissionSucceeded).toBe(true);
      });

      it('should display an error message and log the error on unsuccessful registration', function() {
        authenticationService.registerUser = function() {
          var deferred = $q.defer();
          deferred.reject('Bad');
          return deferred.promise;
        };

        analytics.eventTrack = function(){};
        spyOn(logService, 'error');
        spyOn(utilities, 'getFriendlyErrorMessage').and.callThrough();

        scope.register();
        scope.$apply();

        expect(logService.error).toHaveBeenCalled();
        expect(utilities.getFriendlyErrorMessage).toHaveBeenCalled();
        expect(scope.message).toEqual(errorMessage);
        expect(scope.submissionSucceeded).toBe(false);
      });

      it('should track registration attempts before communicating with the authentication service', function() {
        var callSequence = [];

        authenticationService.signIn = function() {
          return resolvedPromise();
        };
        analytics.eventTrack = function(key, properties){
          callSequence.push(['analytics.eventTrack', key, properties]);
        };
        analytics.setUserProperties = function(){
          callSequence.push('analytics.setUserProperties');
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return resolvedPromise();
        };

        $state.expectTransitionTo(states.dashboard.demo.name);

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
        authenticationService.signIn = function() {
          return resolvedPromise();
        };
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
        var callSequence = [];

        authenticationService.signIn = function() {
          return resolvedPromise();
        };
        analytics.eventTrack = function(key, properties){
          callSequence.push(['analytics.eventTrack', key, properties]);
        };
        analytics.setUserProperties = function(userProperties){
          callSequence.push(['analytics.setUserProperties', userProperties]);
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return resolvedPromise();
        };

        $state.expectTransitionTo(states.dashboard.demo.name);

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

  function resolvedPromise() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  }
});
