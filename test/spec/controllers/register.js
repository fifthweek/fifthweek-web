'use strict';

describe('Controller: RegisterCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var RegisterCtrl;
  var scope;
  var $rootScope;
  var authService;
  var $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    scope = $rootScope.$new();

    authService = {};

    RegisterCtrl = $controller('RegisterCtrl', {
      $scope: scope,
      authService: authService
    });
  }));

  it('should contain empty registration data on creation', function() {
    expect(scope.registrationData.email).toBe('');
    expect(scope.registrationData.username).toBe('');
    expect(scope.registrationData.password).toBe('');
  });

  describe('registerInternalUser', function(){
    it('should redirect on successful registration', function() {
      authService.registerInternalUser = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      scope.register();
      $rootScope.$apply();

      expect(scope.message).toContain('success');
      expect(scope.savedSuccessfully).toBe(true);
    });

    it('should display an error on unsuccessful registration', function() {
      authService.registerInternalUser = function() {
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
