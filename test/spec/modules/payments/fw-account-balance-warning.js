describe('fw-account-balance-warning', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fifthweekConstants;
  var fwAccountBalanceWarningCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwAccountBalanceWarningCtrl', function() { fwAccountBalanceWarningCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
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
      element = angular.element('<fw-account-balance-warning displaying-account-balance-warning="output"/>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should update displayingAccountBalanceWarning on isolate scope', function(){
      scope.output = 'test';
      scope.$digest();
      expect(element.isolateScope().displayingAccountBalanceWarning).toBe('test');
    });

    it('should update displayingAccountBalanceWarning on outer scope', function(){
      element.isolateScope().displayingAccountBalanceWarning = 'test';
      scope.$digest();
      expect(scope.output).toBe('test');
    });

    it('should initialize the controller', function(){
      expect(fwAccountBalanceWarningCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
