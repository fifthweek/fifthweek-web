'use strict';

describe('Controller: RegisterCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var RegisterCtrl;
  var scope;
  var $rootScope;
  var $timeout;
  var $location;
  var authService;
  var $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_, _$timeout_, _$location_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    $timeout = _$timeout_;
    $location = _$location_;
    scope = $rootScope.$new();

    authService = {};

    RegisterCtrl = $controller('RegisterCtrl', {
      $scope: scope,
      $location: $location,
      $timeout: $timeout,
      authService: authService
    });
  }));

  it('should contain empty registration data on creation', function() {
    expect(scope.registrationData.username).toBe('');
    expect(scope.registrationData.password).toBe('');
    expect(scope.registrationData.confirmPassword).toBe('');
  });

  describe('registerInternalUser', function(){
    it('should redirect on successful registration', function() {
      authService.registerInternalUser = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      spyOn($location, 'path').and.callThrough();

      scope.register();
      $rootScope.$apply();
      $timeout.flush();

      expect($location.path).toHaveBeenCalledWith('/signin');
      expect(scope.message).toContain('success');
      expect(scope.savedSuccessfully).toBe(true);
    });

    it('should display an error on unsuccessful registration', function() {
      authService.registerInternalUser = function() {
        var deferred = $q.defer();
        deferred.reject({
          data: {
            modelState: {
              M1: ['Message1'],
              M2: ['Message2']
            }
          }
        });
        return deferred.promise;
      };

      spyOn($location, 'path').and.callThrough();

      scope.register();
      $rootScope.$apply();
      $timeout.flush();

      expect($location.path).not.toHaveBeenCalled();
      expect(scope.message).toContain('Message1');
      expect(scope.message).toContain('Message2');
      expect(scope.savedSuccessfully).toBe(false);
    });
  });
});