'use strict';

describe('sidebar controller', function() {

  // load the controller's module
  beforeEach(module('webApp', 'stateMock'));

  var $controller;
  var scope;
  var $state;
  var navigationOrchestrator;
  var navigationOrchestratorConstants;

  beforeEach(inject(function(_$controller_, $rootScope, _navigationOrchestratorConstants_) {
    $controller = _$controller_;
    scope = $rootScope.$new();
    navigationOrchestratorConstants = _navigationOrchestratorConstants_;

    $state = jasmine.createSpyObj('$state', ['go']);

    navigationOrchestrator = { getPrimaryNavigation: function(){ return undefined; }};
  }));

  // Initialize the controller and a mock scope
  var createController = function () {
    $controller('SidebarCtrl', {
      $scope: scope,
      $state: $state,
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

  describe('when navigate is called', function(){
    beforeEach(function(){
      createController();
    });

    describe('when action defined', function(){
      var actionCalled;
      beforeEach(function(){
        actionCalled = false;
        scope.navigate('state', function(){ actionCalled = true; });
      });

      it('should call the action', function(){
        expect(actionCalled).toBe(true);
      });

      it('should not transition to state', function(){
        expect($state.go).not.toHaveBeenCalled();
      });
    });

    describe('when action not defined', function(){
      beforeEach(function(){
        scope.navigate('state', undefined);
      });

      it('should transition to state', function(){
        expect($state.go).toHaveBeenCalledWith('state');
      });
    });
  });
});
