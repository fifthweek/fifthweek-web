'use strict';

describe('Controller: RegisterCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var RegisterCtrl;
  var scope;
  var $rootScope;
  var authService;
  var $q;
  var $location;
  var webSettings;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_, _$location_, _webSettings_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    scope = $rootScope.$new();
    $location = _$location_;
    webSettings = _webSettings_;

    authService = {};

    RegisterCtrl = $controller('RegisterCtrl', {
      $scope: scope,
      authService: authService
    });
  }));
  
  it('should contain empty registration data on creation', function() {
    expect(scope.registrationData.exampleWork).toBe('');
    expect(scope.registrationData.email).toBe('');
    expect(scope.registrationData.username).toBe('');
    expect(scope.registrationData.password).toBe('');
  });

  describe('registerUser', function(){
    it('should navigate to dashboard on successful registration', function() {
      authService.registerUser = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      authService.signIn = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      spyOn($location, 'path').and.callThrough();

      scope.register();
      $rootScope.$apply();

      expect(scope.message).toContain('Signing in...');
      expect(scope.savedSuccessfully).toBe(true);

      expect($location.path).toHaveBeenCalledWith('/dashboard');
    });

    it('should display an error on unsuccessful registration', function() {
      authService.registerUser = function() {
        var deferred = $q.defer();
        deferred.reject({
          data: {
            message: 'TestMessage'
          }
        });
        return deferred.promise;
      };

      scope.register();
      $rootScope.$apply();

      expect(scope.message).toContain('TestMessage');
      expect(scope.savedSuccessfully).toBe(false);
    });
  });
});
