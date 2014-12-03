'use strict';

describe('Service: authService', function() {

  // load the service's module
  beforeEach(module('webApp'));

  var $httpBackend;
  var $rootScope;
  var authService;
  var localStorageService;
  var webSettings;

  beforeEach(function() {
    localStorageService = {};

    module(function($provide) {
      $provide.value('localStorageService', localStorageService);
    });
  });

  beforeEach(inject(function($injector) {
    authService = $injector.get('authService');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    webSettings = $injector.get('webSettings');
  }));

  var setupSignOutExpectations = function(){
    localStorageService.remove = function(){};
    spyOn(localStorageService, 'remove');
  };

  var executeSignOutExpectations = function(){
    expect(localStorageService.remove).toHaveBeenCalledWith('authenticationData');
    expect(authService.authentication.isAuth).toBeFalsy();
    expect(authService.authentication.username).toBeFalsy();
  };

  describe('registerInternalUser', function(){
    it('should ensure the user is logged out and call the register API', function() {

      setupSignOutExpectations();

      $httpBackend.expectPOST(webSettings.apiBaseUri + 'account/registerInternalUser').respond(200, 'Success');

      var result;
      authService.registerInternalUser({username: 'user'}).then(function(response) { result = response; });

      executeSignOutExpectations();

      $httpBackend.flush();
      $rootScope.$apply();
    });
  });

  describe('signIn', function(){

    it('should set authentication data on successful sign in', function(){
      var signInData = {
        username: 'USERNAME',
        password: 'PASSWORD'
      };

      $httpBackend.expectPOST(webSettings.apiBaseUri + 'token').respond(
        200,
        {
          access_token: 'ACCESSTOKEN',
          refresh_token: 'REFRESHTOKEN'
        });

      localStorageService.set = function(){};
      spyOn(localStorageService, 'set');

      var result;
      authService.signIn(signInData).then(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalled();
      expect(localStorageService.set.calls.mostRecent().args[1].token).toBe('ACCESSTOKEN');
      expect(localStorageService.set.calls.mostRecent().args[1].username).toBe('USERNAME');
      expect(localStorageService.set.calls.mostRecent().args[1].refreshToken).toBe('REFRESHTOKEN');

      expect(authService.authentication.isAuth).toBe(true);
      expect(authService.authentication.username).toBe('USERNAME');

      expect(result.access_token).toBe('ACCESSTOKEN');
      expect(result.refresh_token).toBe('REFRESHTOKEN');
    });

    it('should ensure we are logged out on unsuccessful sign in', function(){
      var signInData = {
        username: 'USERNAME',
        password: 'PASSWORD'
      };

      $httpBackend.expectPOST(webSettings.apiBaseUri + 'token').respond(500, 'Bad');

      setupSignOutExpectations();

      var result;
      authService.signIn(signInData).catch(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      executeSignOutExpectations();

      expect(authService.authentication.isAuth).toBe(false);

      expect(result).toBe('Bad');
    });
  });

  describe('signOut', function(){
    it('should clear the local storage and set the user to unauthenticated', function(){
      setupSignOutExpectations();

      authService.signOut();

      executeSignOutExpectations();
    });
  });

  describe('fillAuthData', function(){
    it('should set authentication dtata into the service if the data exists', function(){
      localStorageService.get = function(){
        return {username: 'USERNAME'};
      };

      authService.fillAuthData();

      expect(authService.authentication.isAuth).toBe(true);
      expect(authService.authentication.username).toBe('USERNAME');
    });

    it('should set authentication data into the service if the data exists', function(){
      localStorageService.get = function(){
        return null;
      };

      authService.fillAuthData();

      expect(authService.authentication.isAuth).toBe(false);
      expect(authService.authentication.username).toBeFalsy();
    });
  });

  describe('refreshToken', function(){
    it('should request a new refresh token and persist it if successful', function(){
      localStorageService.get = function(){
        return {username: 'USERNAME'};
      };

      localStorageService.set = jasmine.createSpy();

      var mockResponse = {
        access_token: 'ACCESSTOKEN',
        username: 'USERNAME',
        refresh_token: 'REFRESHTOKEN'
      };

      $httpBackend.expectPOST(webSettings.apiBaseUri + 'token').respond(200, mockResponse);

      var result;
      authService.refreshToken().then(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should request a new refresh token and sign out if unsuccessful', function(){
      localStorageService.get = function(){
        return {username: 'USERNAME'};
      };

      localStorageService.set = jasmine.createSpy();

      $httpBackend.expectPOST(webSettings.apiBaseUri + 'token').respond(500, 'Bad');

      setupSignOutExpectations();

      var result;
      authService.refreshToken().catch(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      executeSignOutExpectations();

      expect(localStorageService.set).not.toHaveBeenCalled();
      expect(result).toBe('Bad');
    });

    it('should error if the user is logged out', function(){
      localStorageService.get = function(){
        return null;
      };

      var result;
      authService.refreshToken().catch(function(response){
        result = response;
      });

      $rootScope.$apply();

      expect(result).toBe('No authentication data available');
    });
  });
});
