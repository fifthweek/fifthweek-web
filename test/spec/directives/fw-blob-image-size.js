describe('fw-blob-image-size directive', function(){
  'use strict';

  beforeEach(function() {
    module('webApp');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  var $rootScope;
  var $compile;

  describe('when creating', function(){

    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
    });

    it('should not add a width or height attribute if neither exist in the scope', function(){
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.attr('width')).toBeUndefined();
      expect(element.attr('height')).toBeUndefined();
    });

    it('should add a width attribute if it exists in the scope', function(){
      scope.width = 99;
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.attr('width')).toBe('99');
    });

    it('should add a height attribute if it exists in the scope', function(){
      scope.height = 99;
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.attr('height')).toBe('99');
    });

    it('should add a width and height attribute if both exist in the scope', function(){
      scope.width = 99;
      scope.height = 77;
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.attr('width')).toBe('99');
      expect(element.attr('height')).toBe('77');
    });

    it('should replace the width attribute if it exists in the scope', function(){
      scope.width = 99;
      var element = angular.element('<span fw-blob-image-size width="10"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.attr('width')).toBe('99');
    });

    it('should replace the height attribute if it exists in the scope', function(){
      scope.height = 99;
      var element = angular.element('<span fw-blob-image-size height="10"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.attr('height')).toBe('99');
    });
  });
});
