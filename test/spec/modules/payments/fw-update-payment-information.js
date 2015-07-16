describe('fw-update-payment-information', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fifthweekConstants;
  var fwUpdatePaymentInformationCtrl;
  var fwUpdatePaymentInformationConstants;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwUpdatePaymentInformationCtrl', function() { fwUpdatePaymentInformationCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fifthweekConstants = $injector.get('fifthweekConstants');
      fwUpdatePaymentInformationConstants = $injector.get('fwUpdatePaymentInformationConstants');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-update-payment-information/>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should set fifthweekConstants to the isolate scope', function(){
      expect(element.isolateScope().fifthweekConstants).toBe(fifthweekConstants);
    });

    it('should set fwUpdatePaymentInformationConstants modes to the isolate scope', function(){
      expect(element.isolateScope().modes).toBe(fwUpdatePaymentInformationConstants.modes);
    });

    it('should initialize the controller', function(){
      expect(fwUpdatePaymentInformationCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
