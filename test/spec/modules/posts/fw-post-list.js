describe('fw-post-list', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwPostListConstants;
  var fwPostListCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwPostListCtrl', function() { fwPostListCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fwPostListConstants = $injector.get('fwPostListConstants');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-post-list source="value"/>');
      scope.value = 'success';
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set sources to the isolate scope', function(){
      expect(element.isolateScope().sources).toEqual(fwPostListConstants.sources);
    });

    it('should set specified source to the isolate scope', function(){
      expect(element.isolateScope().source).toBe('value');
    });

    it('should initialize the post list controller', function(){
      expect(fwPostListCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
