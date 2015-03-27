describe('fw-date-time-picker-controller', function(){
  'use strict';

  var $q;
  var $scope;

  var fifthweekConstants;
  var target;

  var utcDateAsLocal = function(date){
    var copy = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return copy;
  };

  var utcTimeAsLocal = function(date){
    var copy = new Date(date);
    copy.setUTCMinutes(copy.getUTCMinutes() + copy.getTimezoneOffset());
    return copy;
  };

  var localAsUtc = function(date){
    var copy = new Date(date);
    copy.setUTCMinutes(copy.getUTCMinutes() - copy.getTimezoneOffset());
    return copy;
  };

  beforeEach(function() {

    module('webApp');

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
      jasmine.clock().mockDate(new Date('2015-05-11T11:11:11Z'));

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
        expect($scope.$watchGroup).toHaveBeenCalledWith(['date', 'time'], jasmine.any(Function));
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
          ngModelCtrl.$modelValue = new Date('2015-05-11T13:37:19Z');
          ngModelCtrl.$render();
          $scope.$apply();
        });

        it('should set the validity to valid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('dateTime', true);
          expect(ngModelCtrl.$setValidity.calls.count()).toBe(1);
        });

        it('should set the date to a copy of the model value', function(){
          expect($scope.date).toEqual(utcDateAsLocal(ngModelCtrl.$modelValue));
        });

        it('should apply a timezone offset to make UTC look like local time for the time', function(){
          expect($scope.time).toEqual(utcTimeAsLocal(ngModelCtrl.$modelValue));
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

        it('should set date to the next whole hour', function(){
          expect($scope.date).toEqual(utcDateAsLocal(new Date('2015-05-11T00:00:00Z')));
        });

        it('should set time to the next whole hour', function(){
          expect($scope.time).toEqual(utcTimeAsLocal(new Date('2015-05-11T12:00:00Z')));
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
          $scope.date = utcDateAsLocal(new Date('2015-05-11T13:37:19Z'));
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
            $scope.time = utcTimeAsLocal(new Date('2016-06-12T14:36:20Z'));
            $scope.$apply();
          });

          it('should set the view value to the UTC combination of date and time values', function(){
            var expectedResult = new Date('2015-05-11T14:36:00Z');
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
          $scope.time = utcTimeAsLocal(new Date('2015-05-11T13:37:19Z'));
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
            $scope.date = utcDateAsLocal(new Date('2016-06-12T14:36:20Z'));
            $scope.$apply();
          });

          it('should set the view value to the UTC combination of date and time values', function(){
            var expectedResult = new Date('2016-06-12T13:37:00Z');
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
          $scope.date = utcDateAsLocal(new Date('2015-05-11T13:37:19Z'));
          $scope.time = utcTimeAsLocal(new Date('2016-06-12T14:36:20Z'));
          $scope.$apply();
        });

        it('should set the view value to the UTC combination of date and time values', function(){
          var expectedResult = new Date('2015-05-11T14:36:00Z');
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
