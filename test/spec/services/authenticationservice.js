describe('authentication service', function() {
  'use strict';

  describe('when initializing', function(){

    it('should become authenticated if user data exists in local storage', function(){
      localStorageService.get = function(){
        return {username: 'username'};
      };

      authenticationService.init();

      expect(authenticationService.currentUser.authenticated).toBe(true);
      expect(authenticationService.currentUser.username).toBe('username');
    });

    it('should become unauthenticated if user data absent from local storage', function(){
      localStorageService.get = function(){
        return null;
      };

      authenticationService.init();

      expect(authenticationService.currentUser.authenticated).toBe(false);
      expect(authenticationService.currentUser.username).toBeFalsy();
    });
  });

  describe('when registering a user', function(){

    it('should ensure the user is logged out and call the register API', function() {

      setupSignOutExpectations();

      var registrationData = {username: 'user'};

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'membership/registrations', registrationData).respond(200, {});

      var result;
      authenticationService.registerUser(registrationData).then(function(response) { result = response; });

      executeSignOutExpectations();

      $httpBackend.flush();
      $rootScope.$apply();
    });

    it('should track the user details against the analytics providers', function() {

      setupSignOutExpectations();

      var registrationData = {username: 'user'};

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'membership/registrations', registrationData).respond(200, {});

      var result;
      authenticationService.registerUser(registrationData).then(function(response) { result = response; });

      executeSignOutExpectations();

      $httpBackend.flush();
      $rootScope.$apply();
    });

    it('should return an ApiError on an unexpected response', function() {

      setupSignOutExpectations();

      var registrationData = {username: 'user'};

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'membership/registrations', registrationData).respond(500, { message: 'Bad' });

      var result;
      authenticationService.registerUser(registrationData).catch(function(response) { result = response; });

      executeSignOutExpectations();

      $httpBackend.flush();
      $rootScope.$apply();

      expect(result instanceof ApiError).toBeTruthy();
      expect(result.message).toBe('Bad');
    });

  });

  describe('when signing a user in', function(){

    it('should set authentication data on successful sign in', function(){
      var signInData = {
        username: 'username',
        password: 'PASSWORD'
      };

      setupSignOutExpectations();

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'token').respond(
        200,
        {
          access_token: 'ACCESSTOKEN',
          refresh_token: 'REFRESHTOKEN'
        });

      analytics.setUsername = function(){};
      localStorageService.set = function(){};
      spyOn(localStorageService, 'set');

      var result;
      authenticationService.signIn(signInData).then(function(response){
        result = response;
      });

      executeSignOutExpectations();

      $httpBackend.flush();
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalled();
      expect(localStorageService.set.calls.mostRecent().args[1].token).toBe('ACCESSTOKEN');
      expect(localStorageService.set.calls.mostRecent().args[1].username).toBe('username');
      expect(localStorageService.set.calls.mostRecent().args[1].refreshToken).toBe('REFRESHTOKEN');

      expect(authenticationService.currentUser.authenticated).toBe(true);
      expect(authenticationService.currentUser.username).toBe('username');

      expect(result).toBeUndefined();
    });

    it('should normalise username using same rules as API', function() {
      // Ensure these are consistent with fifthweek-api 'UserInputNormalizationTests'.

      var signInData = {
        username: '  \t\nUSERNAME\t\n  ',
        password: 'PASSWORD'
      };

      setupSignOutExpectations();

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'token').respond(200, {});

      analytics.setUsername = function(){};
      localStorageService.set = function(){};
      spyOn(localStorageService, 'set');

      authenticationService.signIn(signInData);

      $httpBackend.flush();
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalled();
      expect(localStorageService.set.calls.mostRecent().args[1].username).toBe('username');

      expect(authenticationService.currentUser.authenticated).toBe(true);
      expect(authenticationService.currentUser.username).toBe('username');
    });

    it('should ensure we are logged out on unsuccessful sign in', function(){
      var signInData = {
        username: 'username',
        password: 'PASSWORD'
      };

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'token').respond(500, { error_description: 'Bad' });

      setupSignOutExpectations();

      var result;
      authenticationService.signIn(signInData).catch(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      executeSignOutExpectations();

      expect(authenticationService.currentUser.authenticated).toBe(false);

      expect(result instanceof ApiError).toBeTruthy();
      expect(result.message).toBe('Bad');
    });

    it('should track the username against the analytics providers', function () {
      var someUUID = 'fbb6ccee-822b-423f-b8cf-e08677f82c1f';
      var signInData = {
        username: 'username',
        password: 'PASSWORD'
      };

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'token').respond(200, {'user_id': someUUID});
      localStorageService.remove = function(){};
      localStorageService.set = function(){};
      analytics.setUsername = function(){};
      spyOn(analytics, 'setUsername');

      authenticationService.signIn(signInData);
      $httpBackend.flush();
      $rootScope.$apply();

      expect(analytics.setUsername).toHaveBeenCalledWith(someUUID);
    });
  });

  describe('signing a user out', function(){

    it('should clear the local storage and set the user to unauthenticated', function(){
      setupSignOutExpectations();

      authenticationService.signOut();

      executeSignOutExpectations();
    });
  });

  describe('when refreshing', function(){

    it('should request a new refresh token and persist it if successful', function(){
      localStorageService.get = function(){
        return {username: 'username'};
      };

      localStorageService.set = jasmine.createSpy();

      var mockResponse = {
        access_token: 'ACCESSTOKEN',
        username: 'username',
        refresh_token: 'REFRESHTOKEN'
      };

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'token').respond(200, mockResponse);

      var result;
      authenticationService.refreshToken().then(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should request a new refresh token and sign out if unsuccessful', function(){
      localStorageService.get = function(){
        return {username: 'username'};
      };

      localStorageService.set = jasmine.createSpy();

      $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'token').respond(500, { error_description: 'Bad' });

      setupSignOutExpectations();

      var result;
      authenticationService.refreshToken().catch(function(response){
        result = response;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      executeSignOutExpectations();

      expect(localStorageService.set).not.toHaveBeenCalled();

      expect(result instanceof ApiError).toBeTruthy();
      expect(result.message).toBe('Bad');
    });

    it('should error if the user is logged out', function(){
      localStorageService.get = function(){
        return null;
      };

      var result;
      authenticationService.refreshToken().catch(function(response){
        result = response;
      });

      $rootScope.$apply();

      expect(result instanceof FifthweekError).toBeTruthy();
      expect(result.message).toBe('No local authentication data available.');
    });
  });

  // load the service's module
  beforeEach(module('webApp'));

  var $httpBackend;
  var $rootScope;
  var authenticationService;
  var localStorageService;
  var analytics;
  var fifthweekConstants;

  beforeEach(function() {
    localStorageService = {};
    analytics = {};

    module(function($provide) {
      $provide.value('localStorageService', localStorageService);
      $provide.value('$analytics', analytics);
    });
  });

  beforeEach(inject(function($injector) {
    authenticationService = $injector.get('authenticationService');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    fifthweekConstants = $injector.get('fifthweekConstants');
  }));

  var setupSignOutExpectations = function(){
    localStorageService.remove = function(){};
    spyOn(localStorageService, 'remove');
  };

  var executeSignOutExpectations = function(){
    expect(localStorageService.remove).toHaveBeenCalledWith('authenticationData');
    expect(authenticationService.currentUser.authenticated).toBeFalsy();
    expect(authenticationService.currentUser.username).toBeFalsy();
  };
});
