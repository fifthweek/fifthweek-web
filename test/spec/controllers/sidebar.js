'use strict';

describe('sidebar controller', function() {

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var $controller;
  var scope;
  var navigationOrchestrator;
  var navigationOrchestratorConstants;

  beforeEach(inject(function(_$controller_, $rootScope, _navigationOrchestratorConstants_) {
    $controller = _$controller_;
    scope = $rootScope.$new();
    navigationOrchestratorConstants = _navigationOrchestratorConstants_;

    navigationOrchestrator = { getPrimaryNavigation: function(){ return undefined; }};
  }));

  // Initialize the controller and a mock scope
  var createController = function () {
    $controller('SidebarCtrl', {
      $scope: scope,
      navigationOrchestrator: navigationOrchestrator,
      navigationOrchestratorConstants: navigationOrchestratorConstants
    });
  };

  it('should attach to the navigationChanged event when created', function() {
    spyOn(scope, '$on');

    createController();

    expect(scope.$on).toHaveBeenCalled();
    expect(scope.$on.calls.first().args[0]).toBe(navigationOrchestratorConstants.navigationChangedEvent);
  });

  it('should assign the current primary navigation to the scope', function() {
    spyOn(navigationOrchestrator, 'getPrimaryNavigation').and.returnValue('nav');

    createController();

    expect(navigationOrchestrator.getPrimaryNavigation).toHaveBeenCalled();
    expect(scope.navigation).toBe('nav');
  });

  describe('when navigationChanged event is called', function(){
    beforeEach(function(){
      createController();
    });

    it('should assign the new primary navigation to the scope', function(){
      scope.$broadcast(navigationOrchestratorConstants.navigationChangedEvent, 'primary', 'secondary');

      expect(scope.navigation).toBe('primary');
    });
  });
});
