'use strict';

describe('index controller', function() {

  it('should add the authentication information to the scope', function() {
    expect(scope.currentUser).toBe(authenticationService.currentUser);
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var IndexCtrl;
  var scope;
  var authenticationService;
  var fifthweekConstants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _fifthweekConstants_) {
    scope = $rootScope.$new();
    fifthweekConstants = _fifthweekConstants_;

    authenticationService = function() {};
    authenticationService.currentUser = 'ABCD';

    IndexCtrl = $controller('IndexCtrl', {
      $scope: scope,
      authenticationService: authenticationService
    });
  }));
});
