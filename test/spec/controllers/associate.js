'use strict';

describe('Controller: AssociateCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var AssociateCtrl;
  var scope;
  var $rootScope;
  var $location;
  var $timeout;
  var authService;
  var $q;
  var webSettings;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_, _$location_, _$timeout_, _webSettings_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $location = _$location_;
    $timeout = _$timeout_;
    $q = _$q_;
    webSettings = _webSettings_;

    authService = {
      externalAuthData: {
        username: 'user',
        provider: 'facebook',
        externalAccessToken: '1234'
      }
    };

    AssociateCtrl = $controller('AssociateCtrl', {
      $scope: scope,
      $location: $location,
      $timeout: $timeout,
      authService: authService
    });
  }));

  it('should redirect the user on successful registration', function() {
    authService.registerExternalUser = function(){
      var deferred = $q.defer();
      deferred.resolve();
      return deferred.promise;
    };

    spyOn($location, 'path');

    scope.registerExternalUser();
    $rootScope.$apply();
    $timeout.flush();

    expect(scope.savedSuccessfully).toBe(true);
    expect($location.path).toHaveBeenCalledWith(webSettings.successfulSignInPath);
  });

  it('should display an error message on unsuccessful registration', function() {
    authService.registerExternalUser = function(){
      var deferred = $q.defer();
      var response = {
        modelState: {
          blah: 'woop',
          blah2: 'wap'
        }
      };
      
      deferred.reject(response);
      return deferred.promise;
    };

    spyOn($location, 'path');

    scope.registerExternalUser();
    $rootScope.$apply();
    $timeout.flush();

    expect(scope.savedSuccessfully).toBe(false);
    expect($location.path).not.toHaveBeenCalled();
    expect(scope.message).toContain('Failed to register');
    expect(scope.message).toContain('woop');
    expect(scope.message).toContain('wap');
  });
});