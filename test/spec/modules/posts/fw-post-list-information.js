describe('fw-post-list-information', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwPostListConstants;
  var fifthweekConstants;
  var fwPostListInformationCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwPostListInformationCtrl', function() { fwPostListInformationCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fwPostListConstants = $injector.get('fwPostListConstants');
      fifthweekConstants = $injector.get('fifthweekConstants');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-post-list-information source="value"/>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set sources to the isolate scope', function(){
      expect(element.isolateScope().sources).toBe(fwPostListConstants.sources);
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should set specified source to the isolate scope', function(){
      expect(element.isolateScope().source).toBe('value');
    });

    it('should initialize the post list controller', function(){
      expect(fwPostListInformationCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
