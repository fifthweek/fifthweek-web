describe('fw-date-time-picker directive', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwDateTimePickerCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwDateTimePickerCtrl', function() { fwDateTimePickerCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
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

    it('should initialize the date time picker controller with the ngModel controller', function(){
      var element = angular.element('<fw-date-time-picker ng-model="value"/>');
      scope.value = 'success';
      $compile(element)(scope);
      scope.$digest();

      expect(fwDateTimePickerCtrl.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
        $modelValue: 'success'
      }));
    });
  });
});
