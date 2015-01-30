describe('authentication interceptor', function() {
  'use strict';

  describe('when intercepting a request', function() {

    it('should add authentication data to the request headers', function() {
      authenticationService.currentUser = {
        authenticated: true,
        accessToken: 'ABC'
      };

      var config = {};
      var newConfig = authenticationInterceptor.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers.Authorization).toBe('Bearer ABC');
    });
  });

  describe('when intercepting a response', function() {

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
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
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
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
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
        var deferred = $q.defer();
        deferred.reject();
        return deferred.promise;
      };

      spyOn($location, 'path').and.callThrough();

      var result;
      authenticationInterceptor.responseError(rejection).catch(
        function(promiseResult) {
          result = promiseResult;
        });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.status).toBe(401);

      expect($location.path).toHaveBeenCalledWith(fifthweekConstants.signInPage);
    });

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
  });

  // load the service's module
  beforeEach(module('webApp', 'stateMock'));

  var $rootScope;
  var $state;
  var $location;
  var $httpBackend;
  var $q;
  var authenticationInterceptor;
  var authenticationService;
  var fifthweekConstants;

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
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    authenticationInterceptor = $injector.get('authenticationInterceptor');
    fifthweekConstants = $injector.get('fifthweekConstants');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});
