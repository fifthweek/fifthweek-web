'use strict';

describe('index controller', function() {

  it('should log the user out and redirect home when a sign out is requested', function() {
    authenticationService.signOut = function(){};
    spyOn(authenticationService, 'signOut');
    spyOn($location, 'path');

    scope.signOut();

    expect(authenticationService.signOut).toHaveBeenCalled();
    expect($location.path).toHaveBeenCalledWith(fifthweekConstants.homePage);
  });

  it('should add the authentication information to the scope', function() {
    expect(scope.currentUser).toBe(authenticationService.currentUser);
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var IndexCtrl;
  var scope;
  var $location;
  var authenticationService;
  var fifthweekConstants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$location_, _fifthweekConstants_) {
    scope = $rootScope.$new();
    $location = _$location_;
    fifthweekConstants = _fifthweekConstants_;

    authenticationService = function() {};
    authenticationService.currentUser = 'ABCD';

    IndexCtrl = $controller('IndexCtrl', {
      $scope: scope,
      $location: $location,
      authenticationService: authenticationService
    });
  }));
});
