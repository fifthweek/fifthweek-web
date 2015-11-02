describe('fw-image-block', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwImageBlockCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwImageBlockCtrl', function() { fwImageBlockCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
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
      element = angular.element('<fw-image-block />');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should initialize the controller', function(){
      expect(fwImageBlockCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
