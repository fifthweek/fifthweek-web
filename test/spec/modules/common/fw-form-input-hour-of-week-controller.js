describe('fw-form-input-hour-of-week-controller', function(){
  'use strict';

  var $q;
  var $scope;

  var target;

  beforeEach(function() {

    module('webApp');

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwFormInputHourOfWeekCtrl', { $scope: $scope });
    });
  };

  describe('when being created', function(){
    beforeEach(function(){
      createController();
    });

    it('expose an array of days', function(){
      expect($scope.model.days).toBeDefined();
      expect($scope.model.days.length).toBe(7);
    });

    it('expose an array of hours', function(){
      expect($scope.model.hours).toBeDefined();
      expect($scope.model.hours.length).toBe(24);
    });

    it('expose an initialize function', function(){
      expect(target.initialize).toBeDefined();
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
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

      it('should set-up a watch on the day and hour variables', function(){
        expect($scope.$watchGroup).toHaveBeenCalledWith(['model.day', 'model.hour'], jasmine.any(Function));
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
          ngModelCtrl.$modelValue = 50;
          ngModelCtrl.$render();
          $scope.$apply();
        });

        it('should set the validity to valid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('hourOfWeek', true);
        });

        it('should set the day component of the model value', function(){
          expect($scope.model.day).toEqual({
            name: 'Tuesday',
            value: 48
          });
        });

        it('should set the hour component of the model value', function(){
          expect($scope.model.hour).toEqual({
            name: '02:00',
            value: 2
          });
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
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('hourOfWeek', true);
        });

        it('should set the day component to Monday', function(){
          expect($scope.model.day).toEqual({
            name: 'Monday',
            value: 24
          });
        });

        it('should set the hour component to Midnight', function(){
          expect($scope.model.hour).toEqual({
            name: '00:00',
            value: 0
          });
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

      it('should set the view value to undefined when initializing watches', function(){
        expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
      });

      it('should set the validity to invalid when initializing watches', function(){
        expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('hourOfWeek', false);
      });

      describe('when assigning a day', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          $scope.model.day = { name: 'Monday', value: 24 };
          $scope.$apply();
        });

        it('should set the view value to undefined', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
        });

        it('should set the validity to invalid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('hourOfWeek', false);
        });
      });

      describe('when assigning a time', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          $scope.model.hour = { name: '10:00', value: 10 };
          $scope.$apply();
        });

        it('should set the view value to undefined', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
        });

        it('should set the validity to invalid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('hourOfWeek', false);
        });
      });

      describe('when assigning a date and time', function(){
        beforeEach(function(){
          ngModelCtrl.$setViewValue.calls.reset();
          ngModelCtrl.$setValidity.calls.reset();
          $scope.model.day = { name: 'Monday', value: 24 };
          $scope.model.hour = { name: '10:00', value: 10 };
          $scope.$apply();
        });

        it('should set the view value to the combination of date and time values', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(34);
        });

        it('should set the validity to valid', function(){
          expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('hourOfWeek', true);
        });
      });
    });
  });
});
