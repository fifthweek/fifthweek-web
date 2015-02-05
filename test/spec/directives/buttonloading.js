describe('loading button directive', function(){
  'use strict';

  describe('when not loading', function(){

    it('should display the default text', function(){
      expect(element.html()).toBe('default');
    });

    it('should not be disabled', function(){
      expect(element.hasClass('disabled')).toBeFalsy();
      expect(element.attr('disabled')).toBeFalsy();
    });

    var element;

    beforeEach(function(){
      var scope = $rootScope.$new();
      scope.isLoading = false;

      element = angular.element('<button data-loading-text="loading" button-loading="isLoading">default</button>');
      $compile(element)(scope);
      scope.$digest();
    });
  });

  describe('when loading', function(){

    it('should display the loading text', function(){
      expect(element.html()).toBe('loading');
    });

    it('should be disabled', function(){
      expect(element.hasClass('disabled')).toBeTruthy();
      expect(element.attr('disabled')).toBeTruthy();
    });

    var element;

    beforeEach(function(){
      var scope = $rootScope.$new();
      scope.isLoading = true;

      element = angular.element('<button data-loading-text="loading" button-loading="isLoading">default</button>');
      $compile(element)(scope);
      scope.$digest();
    });
  });

  describe('when not loading but has separate disabled directive', function(){

    it('should display the default text if disabled directive value is false', function(){
      expect(element.html()).toBe('default');
    });

    it('should display the default text if disabled directive value is true', function(){
      scope.isDisabled = true;
      scope.$digest();
      expect(element.html()).toBe('default');
    });

    it('should not be disabled if disabled directive value is false', function(){
      expect(element.hasClass('disabled')).toBeFalsy();
      expect(element.attr('disabled')).toBeFalsy();
    });

    it('should be disabled if disabled directive value is true', function(){
      scope.isDisabled = true;
      scope.$digest();
      expect(element.hasClass('disabled')).toBeFalsy(); // ng-disabled doesn't add this.
      expect(element.attr('disabled')).toBeTruthy();
    });

    var element;
    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
      scope.isLoading = false;
      scope.isDisabled = false;

      element = angular.element('<button ng-disabled="isDisabled" data-loading-text="loading" button-loading="isLoading">default</button>');
      $compile(element)(scope);
      scope.$digest();
    });
  });

  describe('when loading but has separate disabled directive', function(){

    it('should display the loading text if disabled directive value is false', function(){
      expect(element.html()).toBe('loading');
    });

    it('should display the loading text if disabled directive value is true', function(){
      scope.isDisabled = true;
      scope.$digest();
      expect(element.html()).toBe('loading');
    });

    it('should not be disabled if disabled directive value is false', function(){
      expect(element.hasClass('disabled')).toBeFalsy();
      expect(element.attr('disabled')).toBeFalsy();
    });

    it('should be disabled if disabled directive value is true', function(){
      scope.isDisabled = true;
      scope.$digest();
      expect(element.hasClass('disabled')).toBeFalsy(); // ng-disabled doesn't add this.
      expect(element.attr('disabled')).toBeTruthy();
    });

    var element;
    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
      scope.isLoading = true;
      scope.isDisabled = false;

      element = angular.element('<button ng-disabled="isDisabled" data-loading-text="loading" button-loading="isLoading">default</button>');
      $compile(element)(scope);
      scope.$digest();
    });
  });

  beforeEach(function() {
    module('webApp');
  });

  var $rootScope;
  var $compile;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  }));
});
