describe('fw-sir-trevor-editor', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwSirTrevorEditorCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwSirTrevorEditorCtrl', function() { fwSirTrevorEditorCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-sir-trevor-editor ng-model="value"/>');
      scope.value = 'success';
      $compile(element)(scope);
      scope.$digest();
    });

    it('should initialize the controller', function(){
      expect(fwSirTrevorEditorCtrl.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
        $modelValue: 'success'
      }));
    });
  });
});
