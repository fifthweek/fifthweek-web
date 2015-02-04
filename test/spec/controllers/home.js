'use strict';

describe('home controller', function() {

  describe('when the user is not authenticated', function(){

    it('should contain empty registration data on creation', function() {
      expect(scope.registrationData.email).toBe('');
      expect(scope.registrationData.username).toBe('');
      expect(scope.registrationData.password).toBe('');
    });

    describe('and submits the form', function() {


      it('should navigate to dashboard on successful registration', function() {
        authenticationService.registerUser = function() { return resolvedPromise(); };
        authenticationService.signIn = function() { return resolvedPromise(); };
        analytics.eventTrack = function(){};
        analytics.setUserProperties = function(){};

        $state.expectTransitionTo(states.dashboard.demo.name);

        scope.register();
        $rootScope.$apply();

        expect(scope.message).toContain('Signing in...');
        expect(scope.savedSuccessfully).toBe(true);
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
        $rootScope.$apply();

        expect(logService.error).toHaveBeenCalled();
        expect(utilities.getFriendlyErrorMessage).toHaveBeenCalled();
        expect(scope.message).toEqual(errorMessage);
        expect(scope.savedSuccessfully).toBe(false);
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
        $rootScope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Registration submitted', eventCategory],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration succeeded', eventCategory]
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
        $rootScope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Registration submitted', eventCategory],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration failed', eventCategory]
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
        $rootScope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Registration submitted', eventCategory],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration succeeded', eventCategory]
        ]);
      });

      var eventCategory = {
        'category': 'Registration'
      };

      beforeEach(function() {
        scope.registrationData = {
          email: 'lawrence@fifthweek.com',
          username: 'lawrence',
          password: 'password'
        };
      });
    });

    var logService;
    var utilities;
    var errorMessage = '!';

    beforeEach(function() {
      authenticationService = { currentUser: { authenticated: false }};
      logService = { error: function(){} };
      utilities = { getFriendlyErrorMessage: function(){ return errorMessage; } };

      HomeCtrl = $controller('HomeCtrl', {
        $scope: scope,
        authenticationService: authenticationService,
        logService: logService,
        utilities: utilities
      });
    });
  });

  describe('when the user is already authenticated', function(){

    it('should redirect to the dashboard page', function(){

      $state.expectTransitionTo(states.dashboard.demo.name);

      HomeCtrl = $controller('HomeCtrl', {
        $scope: scope,
        authenticationService: authenticationService
      });
    });

    beforeEach(function() {
      authenticationService = { currentUser: { authenticated: true }};
    });
  });

  describe('modal with video', function(){

    it('should contain an openModal function', function(){
      expect(scope.openModal).toBeDefined();

    });

    beforeEach(function() {
      HomeCtrl = $controller('HomeCtrl', {
        $scope: scope
      });
    });

  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var HomeCtrl;
  var scope;
  var $rootScope;
  var $state;
  var authenticationService;
  var $q;
  var states;
  var $controller;
  var analytics;

  beforeEach(function() {
    analytics = {};

    module(function($provide) {
      $provide.value('$analytics', analytics);
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, _$rootScope_, _$state_, _$q_, _states_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    scope = $rootScope.$new();
    $q = _$q_;
    states = _states_;
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  function resolvedPromise() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  }
});
