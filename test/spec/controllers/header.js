'use strict';

describe('header controller', function() {

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

    navigationOrchestrator = { getSecondaryNavigation: function(){ return undefined; }};
  }));

  // Initialize the controller and a mock scope
  var createController = function () {
    $controller('HeaderCtrl', {
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

  it('should assign the current secondary navigation to the scope', function() {
    spyOn(navigationOrchestrator, 'getSecondaryNavigation').and.returnValue('nav');

    createController();

    expect(navigationOrchestrator.getSecondaryNavigation).toHaveBeenCalled();
    expect(scope.navigation).toBe('nav');
  });

  describe('when navigationChanged event is called', function(){
    beforeEach(function(){
      createController();
    });

    it('should assign the new secondary navigation to the scope', function(){
      scope.$broadcast(navigationOrchestratorConstants.navigationChangedEvent, 'primary', 'secondary');

      expect(scope.navigation).toBe('secondary');
    });
  });

  describe('when titleToId is called', function(){
    beforeEach(function(){
      createController();
    });

    it('should convert the title to an id', function(){
      expect(scope.titleToId('This is a Title')).toBe('navigation-this-is-a-title');
    });
  });
});
