'use strict';

describe('registration controller', function() {

  describe('when the user is not authenticated', function(){

    it('should contain empty registration data on creation', function() {
      expect(scope.registrationData.exampleWork).toBe('');
      expect(scope.registrationData.email).toBe('');
      expect(scope.registrationData.username).toBe('');
      expect(scope.registrationData.password).toBe('');
    });

    it('should navigate to dashboard on successful registration', function() {
      authenticationService.registerUser = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      authenticationService.signIn = function() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      spyOn($location, 'path').and.callThrough();

      scope.register();
      $rootScope.$apply();

      expect(false).toBeTruthy();
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

      scope.register();
      $rootScope.$apply();

      expect(scope.message).toContain('TestMessage');
      expect(scope.savedSuccessfully).toBe(false);
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

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_, _fifthweekConstants_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;
    $location = _$location_;
    fifthweekConstants = _fifthweekConstants_;
  }));
});
