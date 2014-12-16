'use strict';

describe('registration controller', function() {

  describe('when the user is not authenticated', function(){

    it('should contain empty registration data on creation', function() {
      expect(scope.registrationData.exampleWork).toBe('');
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

        spyOn($location, 'path').and.callThrough();

        scope.register();
        $rootScope.$apply();

        expect(scope.message).toContain('Signing in...');
        expect(scope.savedSuccessfully).toBe(true);

        expect($location.path).toHaveBeenCalledWith(fifthweekConstants.dashboardPage);
      });

      it('should display an error on unsuccessful registration', function() {
        authenticationService.registerUser = function() {
          var deferred = $q.defer();
          deferred.reject({
            data: {
              message: 'TestMessage'
            }
          });
          return deferred.promise;
        };

        analytics.eventTrack = function(){};

        scope.register();
        $rootScope.$apply();

        expect(scope.message).toContain('TestMessage');
        expect(scope.savedSuccessfully).toBe(false);
      });

      it('track registration attempts before communicating with the authentication service', function() {
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

        spyOn(analytics, 'eventTrack').and.callThrough();

        scope.register();
        $rootScope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Submitted registration', analyticsData],
          'authenticationService.registerUser',
          'analytics.setUserProperties'
        ]);
      });

      it('track unsuccessful registrations', function() {
        var callSequence = [];
        var failureData = {'error message': 'Bad' };
        authenticationService.signIn = function() {
          return resolvedPromise();
        };
        analytics.eventTrack = function(key, properties){
          callSequence.push(['analytics.eventTrack', key, properties]);
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return $q.reject({
            data: {
              message : 'Bad'
            }
          });
        };

        spyOn(analytics, 'eventTrack').and.callThrough();

        scope.register();
        $rootScope.$apply();

        expect(callSequence).toEqual([
          ['analytics.eventTrack', 'Submitted registration', analyticsData],
          'authenticationService.registerUser',
          ['analytics.eventTrack', 'Registration failed', failureData]
        ]);
      });

      it('track successful registrations by setting the form data as user properties', function() {
        var callSequence = [];

        authenticationService.signIn = function() {
          return resolvedPromise();
        };
        analytics.eventTrack = function(){
          callSequence.push('analytics.eventTrack');
        };
        analytics.setUserProperties = function(userProperties){
          callSequence.push(['analytics.setUserProperties', userProperties]);
        };
        authenticationService.registerUser = function() {
          callSequence.push('authenticationService.registerUser');
          return resolvedPromise();
        };

        spyOn(analytics, 'setUserProperties').and.callThrough();

        scope.register();
        $rootScope.$apply();

        expect(callSequence).toEqual([
          'analytics.eventTrack',
          'authenticationService.registerUser',
          ['analytics.setUserProperties', analyticsData],
        ]);
      });

      var analyticsData = {
        'example work': 'www.fifthweek.com',
        'email': 'lawrence@fifthweek.com',
        'username': 'lawrence'
      };

      beforeEach(function() {
        scope.registrationData = {
          exampleWork: 'www.fifthweek.com',
          email: 'lawrence@fifthweek.com',
          username: 'lawrence',
          password: 'password'
        };
      });
    });


    beforeEach(function() {
      authenticationService = { currentUser: { authenticated: false }};

      RegisterCtrl = $controller('RegisterCtrl', {
        $scope: scope,
        authenticationService: authenticationService
      });
    });
  });

  describe('when the user is already authenticated', function(){

    it('should redirect to the dashboard page', function(){
      spyOn($location, 'path').and.callThrough();

      RegisterCtrl = $controller('RegisterCtrl', {
        $scope: scope,
        authenticationService: authenticationService
      });

      expect($location.path).toHaveBeenCalledWith(fifthweekConstants.dashboardPage);
    });

    beforeEach(function() {
      authenticationService = { currentUser: { authenticated: true }};
    });
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var RegisterCtrl;
  var scope;
  var $rootScope;
  var authenticationService;
  var $q;
  var $location;
  var fifthweekConstants;
  var $controller;
  var analytics;

  beforeEach(function() {
    analytics = {};

    module(function($provide) {
      $provide.value('$analytics', analytics);
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_, _fifthweekConstants_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;
    $location = _$location_;
    fifthweekConstants = _fifthweekConstants_;
  }));

  function resolvedPromise() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  }
});
