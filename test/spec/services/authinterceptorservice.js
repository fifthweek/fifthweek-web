'use strict';

describe('Service: authInterceptorService', function() {

  // load the service's module
  beforeEach(module('webApp'));

  var $rootScope;
  var $location;
  var $httpBackend;
  var $q;
  var authInterceptorService;
  var localStorageService;
  var authService;

  beforeEach(function() {
    localStorageService = {};
    authService = {};
    module(function($provide) {
      $provide.value('localStorageService', localStorageService);
      $provide.value('authService', authService);
    });
  });

  beforeEach(inject(function($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    authInterceptorService = $injector.get('authInterceptorService');
  }));

  describe('request', function() {
    it('should add authentication data to the request headers', function() {
      localStorageService.get = function() { return { token: 'ABC' }; };

      var config = {};
      var newConfig = authInterceptorService.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers.Authorization).toBe('Bearer ABC');
    });
  });

  describe('responseError', function() {
    var rejection;

    beforeEach(function(){
      rejection = {
        status: 401,
        config: {
          method: 'GET',
          url: '/testUrl'
        }
      };
    });

    it('should ignore status codes other than 401', function() {
      rejection.status = 400;

      var result;
      authInterceptorService.responseError(rejection).catch(
        function(promiseResult) {
          result = promiseResult;
        });

      $rootScope.$apply();

      expect(result).toBe(rejection);
    });

    it('should request a new bearer token and retry the request if the status code is 401', function() {
      localStorageService.get = function() { return { token: 'ABC' }; };
     
      authService.refreshToken = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      $httpBackend.expectGET('/testUrl').respond(200, 'Success');

      var result;
      authInterceptorService.responseError(rejection).then(
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

      localStorageService.get = function() { return { token: 'ABC' }; };
     
      authService.refreshToken = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      $httpBackend.expectGET('/testUrl').respond(401, 'Forbidden');

      var result;
      authInterceptorService.responseError(rejection).catch(
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
      authService.refreshToken = function() {
        var deferred = $q.defer();
        deferred.reject();
        return deferred.promise;
      };

      spyOn($location, 'path').and.callThrough();

      var result;
      authInterceptorService.responseError(rejection).catch(
        function(promiseResult) {
          result = promiseResult;
        });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.status).toBe(401);

      expect($location.path).toHaveBeenCalledWith('/signin');
    });
  });
});