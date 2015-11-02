describe('fw-file-block', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwFileBlockCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwFileBlockCtrl', function() { fwFileBlockCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
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
      element = angular.element('<fw-file-block />');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should initialize the controller', function(){
      expect(fwFileBlockCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
