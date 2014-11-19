'use strict';

describe('Controller: RefreshCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var RefreshCtrl;
  var scope;
  var authService;
  var $rootScope;
  var $location;
  var $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$location_, _$q_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    scope = $rootScope.$new();
    $location = _$location_;

    authService = {};

    RefreshCtrl = $controller('RefreshCtrl', {
      $scope: scope,
      $location: $location,
      authService: authService
    });
  }));

  it('should set a new token response if refreshToken is successful', function() {
    authService.refreshToken = function()
    {
      var deferred = $q.defer();
      deferred.resolve('ABCDE');
      return deferred.promise;
    };

    scope.refreshToken();
    $rootScope.$apply();

    expect(scope.tokenRefreshed).toBe(true);
    expect(scope.tokenResponse).toBe('ABCDE');
  });

  it('should redirect to the sign in page if refreshToken is unsuccessful', function() {
    authService.refreshToken = function()
    {
      var deferred = $q.defer();
      deferred.reject();
      return deferred.promise;
    };

    spyOn($location, 'path').and.callThrough();

    scope.refreshToken();
    $rootScope.$apply();

    expect($location.path).toHaveBeenCalledWith('/signin');
  });
});