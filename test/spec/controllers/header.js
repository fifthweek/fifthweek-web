'use strict';

describe('header controller', function() {

  it('should add the authentication information to the scope', function() {
    expect(scope.currentUser).toBe(authenticationService.currentUser);
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var HeaderCtrl;
  var scope;
  var authenticationService;
  var fifthweekConstants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _fifthweekConstants_) {
    scope = $rootScope.$new();
    fifthweekConstants = _fifthweekConstants_;

    authenticationService = function() {};
    authenticationService.currentUser = 'ABCD';

    HeaderCtrl = $controller('HeaderCtrl', {
      $scope: scope,
      authenticationService: authenticationService
    });
  }));
});
