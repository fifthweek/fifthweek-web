describe('authentication interceptor', function() {
  'use strict';

  // load the service's module
  beforeEach(module('webApp', 'stateMock'));

  var $rootScope;
  var $state;
  var $httpBackend;
  var $q;
  var fifthweekConstants;
  var authenticationInterceptor;
  var authenticationService;
  var states;

  beforeEach(function() {
    authenticationService = {};
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
    });
  });

  beforeEach(inject(function($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $httpBackend = $injector.get('$httpBackend');
    authenticationInterceptor = $injector.get('authenticationInterceptor');
    fifthweekConstants = $injector.get('fifthweekConstants');
    states = $injector.get('states');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $state.verifyNoOutstandingTransitions();
  });

  describe('when intercepting a request', function() {

    it('should add authentication data to the request headers for the API', function() {
      authenticationService.currentUser = {
        authenticated: true,
        accessToken: 'ABC'
      };

      var config = { url: fifthweekConstants.apiBaseUri + 'blah' };
      var newConfig = authenticationInterceptor.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers.Authorization).toBe('Bearer ABC');
    });

    it('should not add authentication data to the request headers for non-API links', function() {
      authenticationService.currentUser = {
        authenticated: true,
        accessToken: 'ABC'
      };

      var config = { url: 'http://www.google.com/blah' };
      var newConfig = authenticationInterceptor.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe('when intercepting a response', function() {

    var rejection;
    var testUrl = '/testUrl';

    beforeEach(function(){
      rejection = {
        status: 401,
        config: {
          method: 'GET',
          url: testUrl
        }
      };
    });

    describe('when no other bearer token request is in progress', function(){


      it('should ignore status codes other than 401', function() {
        rejection.status = 400;

        var result;
        authenticationInterceptor.responseError(rejection).catch(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();

        expect(result).toBe(rejection);
      });

      it('should request a new bearer token and retry the request if the status code is 401', function() {
        authenticationService.refreshToken = function() {
          return $q.when();
        };

        $httpBackend.expectGET(testUrl).respond(200, 'Success');

        var result;
        authenticationInterceptor.responseError(rejection).then(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();
        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
      });

      it('should request a new bearer token if the status code is 401 and retry, and if the retry still says 401 it should give up', function() {
        authenticationService.refreshToken = function() {
          return $q.when();
        };

        $httpBackend.expectGET(testUrl).respond(401, 'Forbidden');

        var result;
        authenticationInterceptor.responseError(rejection).catch(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();
        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.status).toBe(401);
      });

      it('should request a new bearer token if the status code is 401 and redirect to sign in if fetching a bearer token fails', function() {
        authenticationService.refreshToken = function() {
          return $q.reject();
        };

        $state.expectTransitionTo(states.signIn.name);

        var result;
        authenticationInterceptor.responseError(rejection).catch(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.status).toBe(401);
      });
    });

    describe('when a new bearer token request is in progress', function(){

      var initialRequest;
      var initialResult;
      beforeEach(function(){

        initialRequest = undefined;
        initialResult = undefined;

        authenticationService.refreshToken = function() {
          initialRequest = $q.defer();
          return initialRequest.promise;
        };

        authenticationInterceptor.responseError(_.cloneDeep(rejection))
          .then(function(result) {
            initialResult = result;
          })
          .catch(function(result){
            initialResult = result;
          });

        $rootScope.$apply();

        spyOn(authenticationService, 'refreshToken');
      });


      it('should ignore status codes other than 401', function() {
        rejection.status = 400;

        var result;
        authenticationInterceptor.responseError(rejection).catch(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();

        expect(initialResult).not.toBeDefined();
        expect(result).toBeDefined();

        expect(result).toBe(rejection);

        expect(authenticationService.refreshToken).not.toHaveBeenCalled();
      });

      it('should wait for existing promise and retry the request if the status code is 401', function() {
        $httpBackend.whenGET(testUrl).respond(200, 'Success');

        var result;
        authenticationInterceptor.responseError(rejection).then(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();

        expect(initialResult).not.toBeDefined();
        expect(result).not.toBeDefined();

        initialRequest.resolve();

        $rootScope.$apply();
        $httpBackend.flush();
        $rootScope.$apply();

        expect(initialResult).toBeDefined();
        expect(initialResult.status).toBe(200);

        expect(result).toBeDefined();
        expect(result.status).toBe(200);

        expect(authenticationService.refreshToken).not.toHaveBeenCalled();
      });

      it('should wait for existing promise and retry, and if the retry still says 401 it should give up', function() {
        $httpBackend.whenGET(testUrl).respond(401, 'Forbidden');

        var result;
        authenticationInterceptor.responseError(rejection).catch(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();

        expect(initialResult).not.toBeDefined();
        expect(result).not.toBeDefined();

        initialRequest.resolve();

        $rootScope.$apply();
        $httpBackend.flush();
        $rootScope.$apply();

        expect(initialResult).toBeDefined();
        expect(initialResult.status).toBe(401);

        expect(result).toBeDefined();
        expect(result.status).toBe(401);

        expect(authenticationService.refreshToken).not.toHaveBeenCalled();
      });

      it('should wait for existing promise and redirect to sign in if fetching a bearer token fails', function() {

        // We only expect one transition.
        $state.expectTransitionTo(states.signIn.name);

        var result;
        authenticationInterceptor.responseError(rejection).catch(
          function(promiseResult) {
            result = promiseResult;
          });

        $rootScope.$apply();

        expect(initialResult).not.toBeDefined();
        expect(result).not.toBeDefined();

        initialRequest.reject();

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.status).toBe(401);

        expect(authenticationService.refreshToken).not.toHaveBeenCalled();
      });

    });
  });
});
