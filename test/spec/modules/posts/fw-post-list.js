describe('fw-post-list', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwPostListConstants;
  var fifthweekConstants;
  var fwPostListCtrl;
  var landingPageConstants;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwPostListCtrl', function() { fwPostListCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
      $controllerProvider.register('fwPostListHeaderCtrl', function() { this.initialize = jasmine.createSpy('initialize'); });
      $controllerProvider.register('fwPostListInformationCtrl', function() { this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fwPostListConstants = $injector.get('fwPostListConstants');
      fifthweekConstants = $injector.get('fifthweekConstants');
      landingPageConstants = $injector.get('landingPageConstants');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-post-list source="value"/>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set sources to the isolate scope', function(){
      expect(element.isolateScope().sources).toBe(fwPostListConstants.sources);
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should set landingPageConstants to the isolate scope', function(){
      expect(element.isolateScope().landingPageConstants).toBe(landingPageConstants);
    });

    it('should set specified source to the isolate scope', function(){
      expect(element.isolateScope().source).toBe('value');
    });

    it('should initialize the post list controller', function(){
      expect(fwPostListCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
