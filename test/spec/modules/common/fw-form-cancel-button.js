describe('fw-form-cancel-button directive', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var $state;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    $state = jasmine.createSpyObj('$state', ['reload']);

    module(function($provide) {
      $provide.value('$state', $state);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;
    var isolateScope;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-form-cancel-button />');
      scope.value = 'success';
      $compile(element)(scope);
      scope.$digest();

      isolateScope = element.isolateScope();
    });

    it('should create a cancelForm method on the isolate scope', function(){
      expect(isolateScope.cancelForm).toBeDefined();
    });

    it('should not reload the state', function(){
      expect($state.reload).not.toHaveBeenCalled();
    });

    it('should not replace the element with a button', function(){
      expect(element.is('button')).toBe(true);
    });

    describe('when cancelForm is called', function(){
      beforeEach(function(){
        isolateScope.cancelForm();
      });

      it('should reload the state', function(){
        expect($state.reload).toHaveBeenCalled();
      });
    });
  });
});
