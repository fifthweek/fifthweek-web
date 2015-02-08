'use strict';

describe('header controller', function() {

  it('should add the authentication information to the scope', function() {
    expect(scope.currentUser).toBe(authenticationService.currentUser);
  });

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var HeaderCtrl;
  var scope;
  var authenticationService;
  var navigationOrchestrator;
  var navigationOrchestratorConstants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _navigationOrchestratorConstants_) {
    scope = $rootScope.$new();

    navigationOrchestrator = { getSecondaryNavigation: function(){ return []; }};

    navigationOrchestratorConstants = _navigationOrchestratorConstants_;

    authenticationService = function() {};
    authenticationService.currentUser = 'ABCD';

    HeaderCtrl = $controller('HeaderCtrl', {
      $scope: scope,
      authenticationService: authenticationService,
      navigationOrchestrator: navigationOrchestrator,
      navigationOrchestratorConstants: navigationOrchestratorConstants
    });
  }));
});
