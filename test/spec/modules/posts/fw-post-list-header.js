describe('fw-post-list-header', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fifthweekConstants;
  var fwPostListHeaderCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwPostListHeaderCtrl', function() { fwPostListHeaderCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fifthweekConstants = $injector.get('fifthweekConstants');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-post-list-header source="value"/>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should set specified source to the isolate scope', function(){
      expect(element.isolateScope().source).toBe('value');
    });

    it('should initialize the post list controller', function(){
      expect(fwPostListHeaderCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
