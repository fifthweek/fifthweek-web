'use strict';

describe('Controller: SignInCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var SignInCtrl;
  var $rootScope;
  var scope;
  var $location;
  var $q;
  var authService;
  var webSettings;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_, _$location_, _webSettings_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $location = _$location_;
    $q = _$q_;
    webSettings = _webSettings_;

    authService = function() {};

    SignInCtrl = $controller('SignInCtrl', {
      $scope: scope,
      $location: $location,
      authService: authService,
      webSettings: webSettings,
    });
  }));

  it('should navigate to the orders screen on successful sign in', function() {

    authService.signIn = function() {
      var deferred = $q.defer();
      deferred.resolve('success');
      return deferred.promise;
    };

    spyOn($location, 'path').and.callThrough();

    scope.signIn();
    $rootScope.$apply();

    expect($location.path).toHaveBeenCalledWith(webSettings.successfulSignInPath);
  });

  it('should display a message on unsuccessful sign in', function() {

    authService.signIn = function() {
      var deferred = $q.defer();
      var error = {
        error_description: 'bad'
      };
      deferred.reject(error);
      return deferred.promise;
    };

    spyOn($location, 'path').and.callThrough();

    scope.signIn();
    $rootScope.$apply();

    expect($location.path).not.toHaveBeenCalled();
    expect(scope.message).toBe('bad');
  });

  it('should set the window scope and open a new window when authorizing an external provider', function() {
    spyOn(window, 'open');

    scope.authExternalProvider();

    expect(window.$windowScope).toBe(scope);
    expect(window.open).toHaveBeenCalled();
  });

  it('should redirect to associate a new account if externally authorized user doesn\'t have an account already', function() {
    var fragment = {
      hasLocalAccount: 'False',
      provider: 'Facebook',
      externalUsername: 'test user',
      externalAccessToken: '1234'
    };

    authService.signOut = function(){};

    spyOn(authService, 'signOut');
    spyOn($location, 'path').and.callThrough();

    scope.authCompletedCallback(fragment);
    $rootScope.$apply();

    expect(authService.signOut).toHaveBeenCalled();
    expect(authService.externalAuthData).toBeDefined();
    expect(authService.externalAuthData.provider).toBe(fragment.provider);
    expect(authService.externalAuthData.username).toBe(fragment.externalUsername);
    expect(authService.externalAuthData.externalAccessToken).toBe(fragment.externalAccessToken);
    expect($location.path).toHaveBeenCalledWith('/associate');
  });

  it('should obtain an access token and redirect if externally authorized has an account', function() {
    var fragment = {
      hasLocalAccount: 'True',
      provider: 'Facebook',
      externalUsername: 'test user',
      externalAccessToken: '1234'
    };

    authService.signOut = function(){};
    authService.obtainAccessToken = function(){
      var deferred = $q.defer();
      deferred.resolve();
      return deferred.promise;
    };

    spyOn(authService, 'signOut');
    spyOn(authService, 'obtainAccessToken').and.callThrough();
    spyOn($location, 'path').and.callThrough();

    scope.authCompletedCallback(fragment);
    $rootScope.$apply();

    expect(authService.signOut).not.toHaveBeenCalled();
    expect(authService.externalAuthData).toBeUndefined();
    expect($location.path).toHaveBeenCalledWith(webSettings.successfulSignInPath);
  });

  it('should obtain an access token and display an error if externally authorized has an account but can\'t obtain an access token', function() {
    var fragment = {
      hasLocalAccount: 'True',
      provider: 'Facebook',
      externalUsername: 'test user',
      externalAccessToken: '1234'
    };

    authService.signOut = function(){};
    authService.obtainAccessToken = function(){
      var deferred = $q.defer();
      var error = {
        error_description: 'bad'
      };
      deferred.reject(error);
      return deferred.promise;
    };

    spyOn(authService, 'signOut');
    spyOn(authService, 'obtainAccessToken').and.callThrough();
    spyOn($location, 'path').and.callThrough();

    scope.authCompletedCallback(fragment);
    $rootScope.$apply();

    expect(authService.signOut).not.toHaveBeenCalled();
    expect(authService.externalAuthData).toBeUndefined();
    expect($location.path).not.toHaveBeenCalled();
    expect(scope.message).toBe('bad');
  });
});