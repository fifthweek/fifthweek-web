describe('fw-price directive', function(){
  'use strict';

  var $rootScope;
  var $compile;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  describe('when price is a scope variable', function(){

    var scope;
    var element;
    var isolateScope;

    beforeEach(function(){
      scope = $rootScope.$new();
      scope.inputPrice = 10000;
      element = angular.element('<fw-price value="inputPrice" />');
      $compile(element)(scope);
      scope.$digest();

      isolateScope = element.isolateScope();
    });

    it('should store the formatted price', function(){
      expect(isolateScope.formattedPrice).toBe('100.00');
    });

    it('should display the price in a span with a price class', function(){
      var span = $(element.children().first());
      expect(span.is('span')).toBe(true);
      expect(span.hasClass('price')).toBe(true);
    });

    it('should display the formatted price', function(){
      expect(element.text()).toBe('$100.00/week');
    });

    describe('when the value changes', function(){
      beforeEach(function(){
        scope.inputPrice = 123.45;
        scope.$apply();
      });

      it('should store the formatted price', function(){
        expect(isolateScope.formattedPrice).toBe('1.23');
      });

      it('should display the formatted price', function(){
        expect(element.text()).toBe('$1.23/week');
      });
    });
  });
});
