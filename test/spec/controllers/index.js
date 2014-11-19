'use strict';

describe('Controller: IndexCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var IndexCtrl;
  var scope;
  var $location;
  var authService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$location_) {
    scope = $rootScope.$new();
    $location = _$location_;
    
    authService = function() {};
    authService.authentication = 'ABCD';

    IndexCtrl = $controller('IndexCtrl', {
      $scope: scope,
      $location: $location,
      authService: authService
    });
  }));

  it('should log the user out and redirect home when a sign out is requested', function() {
    
    authService.signOut = function(){};
    spyOn(authService, 'signOut');
    spyOn($location, 'path');

    scope.signOut();

    expect(authService.signOut).toHaveBeenCalled();
    expect($location.path).toHaveBeenCalledWith('/home');
  });

  it('should add the authentication information to the scope', function() {
    expect(scope.authentication).toBe(authService.authentication);
  });
});