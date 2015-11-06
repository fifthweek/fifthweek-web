describe('fw-full-post', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fifthweekConstants;
  var fwFullPostCtrl;
  var landingPageConstants;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwFullPostCtrl', function() { fwFullPostCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fifthweekConstants = $injector.get('fifthweekConstants');
      landingPageConstants = $injector.get('landingPageConstants');
    });
  });

  describe('when creating as embedded post', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-full-post />');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should set landingPageConstants to the isolate scope', function(){
      expect(element.isolateScope().landingPageConstants).toBe(landingPageConstants);
    });

    it('should false isDialog to the isolate scope', function(){
      expect(element.isolateScope().isDialog).toBe(false);
    });

    it('should initialize the post list controller', function(){
      expect(fwFullPostCtrl.initialize).toHaveBeenCalledWith();
    });
  });

  describe('when creating as dialog post', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      scope.closeDialog = function(){};
      element = angular.element('<fw-full-post close-dialog="closeDialog()" />');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should set landingPageConstants to the isolate scope', function(){
      expect(element.isolateScope().landingPageConstants).toBe(landingPageConstants);
    });

    it('should true isDialog to the isolate scope', function(){
      expect(element.isolateScope().isDialog).toBe(true);
    });

    it('should initialize the post list controller', function(){
      expect(fwFullPostCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
