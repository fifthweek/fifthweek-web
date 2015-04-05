describe('fw-form-input-hour-of-week directive', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwFormInputHourOfWeekCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwFormInputHourOfWeekCtrl', function() { fwFormInputHourOfWeekCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  describe('when creating', function(){

    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
    });

    it('should initialize the controller with the ngModel controller', function(){
      var element = angular.element('<fw-form-input-hour-of-week ng-model="value"/>');
      scope.value = 'success';
      $compile(element)(scope);
      scope.$digest();

      expect(fwFormInputHourOfWeekCtrl.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
        $modelValue: 'success'
      }));
    });
  });
});
