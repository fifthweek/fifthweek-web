describe('fw-date-time-picker-controller', function(){
  'use strict';

  var $q;
  var $scope;

  var fifthweekConstants;
  var target;

  beforeEach(function() {

    module('webApp');
    module(function($provide) {
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      fifthweekConstants = $injector.get('fifthweekConstants');
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwDateTimePickerCtrl', { $scope: $scope });
    });
  };

  describe('when being created', function(){
    beforeEach(function(){
      createController();
    });

    it('should set up date time picker options', function(){
      expect($scope.dateOptions).toBeDefined();
    });

    it('should set up the default date format', function(){
      expect($scope.format).toBe(fifthweekConstants.longDateFormat);
    });

    it('create an initialize function', function(){
      expect(target.initialize).toBeDefined();
    });
  });

  describe('when created', function(){

    beforeEach(function(){
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2015-01-11T11:11:11Z'));

      createController();
    });

    afterEach(function(){
      jasmine.clock().uninstall();
    });

    describe('when initialize is called', function(){
      var ngModelCtrl;

      beforeEach(function(){
        ngModelCtrl = {};
        spyOn($scope, '$watchGroup');
        target.initialize(ngModelCtrl);
      });

      it('should assign a render function', function(){
        expect(ngModelCtrl.$render).toBeDefined();
      });

      it('should set-up a watch on the date and time variables', function(){
        expect($scope.$watchGroup.calls.count()).toBe(1);
        expect($scope.$watchGroup.calls.first().args[0]).toEqual(['date', 'time']);
      });
    });

    describe('when rendering', function(){
      var ngModelCtrl;

      beforeEach(function() {
        ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue', '$setValidity']);
        target.initialize(ngModelCtrl);
        $scope.$apply();
      });

      describe('when initial model value is set', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          ngModelCtrl.$modelValue = new Date('2015-03-11T13:37:19Z');
          ngModelCtrl.$render();
          $scope.$apply();
        });

        it('should set the validity to valid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', true);
          expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
        });

        it('should set date to the date component of the model value', function(){
          expect($scope.date).toEqual(new Date('2015-03-11T00:00:00Z'));
        });

        it('should set time to be a copy of the model value', function(){
          expect($scope.time).toEqual(ngModelCtrl.$modelValue);
          expect($scope.time).not.toBe(ngModelCtrl.$modelValue);
        });
      });

      describe('when initial model value is not set', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          ngModelCtrl.$modelValue = undefined;
          ngModelCtrl.$render();
          $scope.$apply();
        });

        it('should set the validity to valid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', true);
          expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
        });

        it('should set date to the date component the current date', function(){
          expect($scope.date).toEqual(new Date('2015-01-11T00:00:00Z'));
        });

        it('should set time to the next whole hour', function(){
          expect($scope.time).toEqual(new Date('2015-01-11T12:00:00Z'));
        });
      });
    });

    describe('when setting view value', function(){
      var ngModelCtrl;

      beforeEach(function(){
        ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue', '$setValidity']);
        target.initialize(ngModelCtrl);
        $scope.$apply();
      });

      it('should set the view value to undefined when initializing date and time watches', function(){
        expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
        expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
      });

      it('should set the validity to invalid when initializing date and time watches', function(){
        expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', false);
        expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
      });

      describe('when assigning a date', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          $scope.date = new Date('2015-03-11T13:37:19Z');
          $scope.$apply();
        });

        it('should set the view value to undefined', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
        });

        it('should set the validity to invalid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', false);
          expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
        });

        describe('when assigning a time', function(){
          beforeEach(function(){
            ngModelCtrl.$setViewValue.calls.reset();
            ngModelCtrl.$setValidity.calls.reset();
            $scope.time = new Date('2016-04-12T14:36:20Z');
            $scope.$apply();
          });

          it('should set the view value to the combination of date and time values', function(){
            var expectedResult = new Date('2015-03-11T14:36:00Z');
            expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(expectedResult);
          });

          it('should set the validity to valid', function(){
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', true);
            expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
          });
        });
      });

      describe('when assigning a time', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          $scope.time = new Date('2015-03-11T13:37:19Z');
          $scope.$apply();
        });

        it('should set the view value to undefined', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
        });

        it('should set the validity to invalid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', false);
          expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
        });

        describe('when assigning a date', function(){
          beforeEach(function(){
            ngModelCtrl.$setViewValue.calls.reset();
            ngModelCtrl.$setValidity.calls.reset();
            $scope.date = new Date('2016-04-12T14:36:20Z');
            $scope.$apply();
          });

          it('should set the view value to the combination of date and time values', function(){
            var expectedResult = new Date('2016-04-12T13:37:00Z');
            expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(expectedResult);
          });

          it('should set the validity to valid', function(){
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', true);
            expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
          });
        });
      });

      describe('when assigning a date and time', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          $scope.date = new Date('2015-03-11T13:37:19Z');
          $scope.time = new Date('2016-04-12T14:36:20Z');
          $scope.$apply();
        });

        it('should set the view value to the combination of date and time values', function(){
          var expectedResult = new Date('2015-03-11T14:36:00Z');
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(expectedResult);
          expect(ngModelCtrl.$setViewValue.calls.count()).toBe(1);
        });

        it('should set the validity to valid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', true);
          expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
        });
      });
    });

    describe('when openDatePicker is called', function(){
      var event;
      beforeEach(function(){
        event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
        $scope.opened = false;
        $scope.openDatePicker(event);
      });

      it('should stop the event', function(){
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('it should set open to true', function(){
        expect($scope.opened).toBe(true);
      });
    });
  });
});
