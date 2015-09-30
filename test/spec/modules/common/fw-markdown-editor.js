describe('fw-markdown-editor directive', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwMarkdownEditorCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwMarkdownEditorCtrl', function() { fwMarkdownEditorCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  describe('when creating', function(){

    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
      var element = angular.element('<fw-markdown-editor ng-model="value"/>');
      scope.value = 'success';
      $compile(element)(scope);
      scope.$digest();
    });

    it('should initialize the controller with the ngModel controller', function(){
      expect(fwMarkdownEditorCtrl.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
        $modelValue: 'success'
      }));
    });
  });
});
