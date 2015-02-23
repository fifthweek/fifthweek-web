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

      expect(element.css('width')).toBe('0px');
      expect(element.css('height')).toBe('0px');
    });

    it('should add a width attribute if it exists in the scope', function(){
      scope.width = '99px';
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('99px');
    });

    it('should add a height attribute if it exists in the scope', function(){
      scope.height = '99px';
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('height')).toBe('99px');
    });

    it('should add a width and height attribute if both exist in the scope', function(){
      scope.width = '99px';
      scope.height = '77px';
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('99px');
      expect(element.css('height')).toBe('77px');
    });

    it('should replace the width attribute if it exists in the scope', function(){
      scope.width = '99px';
      var element = angular.element('<span fw-blob-image-size width="10"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('99px');
    });

    it('should replace the height attribute if it exists in the scope', function(){
      scope.height = '99px';
      var element = angular.element('<span fw-blob-image-size height="10"/>');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('height')).toBe('99px');
    });

    it('should add a width attribute if the pending width attribute is present but pending-image class is not present', function(){
      scope.width = '99px';
      scope.pendingWidth = '199px';
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('99px');
    });

    it('should add a height attribute if the pending height attribute is present but pending-image class is not present', function(){
      scope.height = '99px';
      scope.pendingHeight = '199px';
      var element = angular.element('<span fw-blob-image-size />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('height')).toBe('99px');
    });

    it('should add the pending width attribute if it exists in the scope and the pending-image class is present', function(){
      scope.width = '99px';
      scope.pendingWidth = '199px';
      var element = angular.element('<span fw-blob-image-size class="pending-image" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('199px');
    });

    it('should add the pending height attribute if it exists in the scope and the pending-image class is present', function(){
      scope.height = '99px';
      scope.pendingHeight = '199px';
      var element = angular.element('<span fw-blob-image-size class="pending-image" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('height')).toBe('199px');
    });

    it('should add a width attribute if the pending-image class is present but the pending width is not set', function(){
      scope.width = '99px';
      var element = angular.element('<span fw-blob-image-size class="pending-image" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('99px');
    });

    it('should add a height attribute if the pending-image class is present but the pending height is not set', function(){
      scope.height = '99px';
      var element = angular.element('<span fw-blob-image-size class="pending-image" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('height')).toBe('99px');
    });

    it('should not add a width or height attribute if neither exist in the scope and the pending-image class is present', function(){
      var element = angular.element('<span fw-blob-image-size class="pending-image" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.css('width')).toBe('0px');
      expect(element.css('height')).toBe('0px');
    });

  });
});
