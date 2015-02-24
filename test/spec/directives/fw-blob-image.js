describe('fw-blob-image directive', function(){
  'use strict';

  var blobImageCtrlConstants;

  var $rootScope;
  var $compile;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('blobImageCtrl', function() { return {}; });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      blobImageCtrlConstants = $injector.get('blobImageCtrlConstants');
    });
  });

  describe('when creating', function(){

    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
    });

    it('should create a control with an update function on the scope if it does not exist', function(){
      var element = angular.element('<fw-blob-image />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.isolateScope().internalControl).toBeDefined();
      expect(element.isolateScope().internalControl.update).toBeDefined();
    });

    it('should assign a control value on the scope from attribute if control attribute exists', function(){
      scope.something = {
        a: 'a'
      };

      var element = angular.element('<fw-blob-image control="something" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.isolateScope().internalControl).toBeDefined();
      expect(element.isolateScope().internalControl.a).toBeDefined();
    });

    it('should add an update function to the control variable', function(){
      scope.something = {};
      var element = angular.element('<fw-blob-image control="something" />');
      $compile(element)(scope);
      scope.$digest();

      expect(element.isolateScope().internalControl).toBeDefined();
      expect(element.isolateScope().internalControl.update).toBeDefined();
    });

    it('should broadcast an event when update is called', function(){
      var element = angular.element('<fw-blob-image />');
      $compile(element)(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();
      spyOn(isolateScope, '$broadcast');

      isolateScope.internalControl.update('uri', 'containerName', true);

      expect(isolateScope.$broadcast).toHaveBeenCalledWith(blobImageCtrlConstants.updateEvent, 'uri', 'containerName', true);
    });

    it('should broadcast an event when update is called without the availableImmediately parameter', function(){
      var element = angular.element('<fw-blob-image />');
      $compile(element)(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();
      spyOn(isolateScope, '$broadcast');

      isolateScope.internalControl.update('uri', 'containerName');

      expect(isolateScope.$broadcast).toHaveBeenCalledWith(blobImageCtrlConstants.updateEvent, 'uri', 'containerName', undefined);
    });

    it('should broadcast an event when update is called without any parameters', function(){
      var element = angular.element('<fw-blob-image />');
      $compile(element)(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();
      spyOn(isolateScope, '$broadcast');

      isolateScope.internalControl.update();

      expect(isolateScope.$broadcast).toHaveBeenCalledWith(blobImageCtrlConstants.updateEvent);
    });

    it('should broadcast an event with the thumbnail url when update is called and thumbnail is specified', function(){
      var element = angular.element('<fw-blob-image thumbnail="thumb" />');
      $compile(element)(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();
      spyOn(isolateScope, '$broadcast');

      isolateScope.internalControl.update('uri', 'containerName', true);

      expect(isolateScope.$broadcast).toHaveBeenCalledWith(blobImageCtrlConstants.updateEvent, 'uri/thumb', 'containerName', true);
    });
  });

  describe('when created', function(){

    var scope;
    var isolateScope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-blob-image />');
      $compile(element)(scope);
      scope.$digest();

      isolateScope = element.isolateScope();
      isolateScope.model = {};
    });

    describe('when first created', function(){

      beforeEach(function(){
      });

      it('should not display the thumbnail area', function(){
        expect(element.find('.thumbnail-area').length).toBe(0);
      });

      it('should not display the error area', function(){
        expect(element.find('.error-area').length).toBe(0);
      });

      it('should not display the updating area', function(){
        expect(element.find('.updating-area').length).toBe(0);
      });

      it('should display the blank area', function(){
        expect(element.find('.blank-area').length).toBe(1);
      });
    });

    describe('when updating', function(){

      beforeEach(function(){
        isolateScope.model.updating = true;
        isolateScope.$digest();
      });

      it('should not display the thumbnail area', function(){
        expect(element.find('.thumbnail-area').length).toBe(0);
      });

      it('should not display the error area', function(){
        expect(element.find('.error-area').length).toBe(0);
      });

      it('should display the updating area', function(){
        expect(element.find('.updating-area').length).toBe(1);
      });

      it('should not display the blank area', function(){
        expect(element.find('.blank-area').length).toBe(0);
      });
    });

    describe('when an error occurs', function(){

      beforeEach(function(){
        isolateScope.model.errorMessage = 'blah';
        isolateScope.$digest();
      });

      it('should not display the thumbnail area', function(){
        expect(element.find('.thumbnail-area').length).toBe(0);
      });

      it('should display the error area', function(){
        expect(element.find('.error-area').length).toBe(1);
      });

      it('should not display the updating area', function(){
        expect(element.find('.updating-area').length).toBe(0);
      });

      it('should not display the blank area', function(){
        expect(element.find('.blank-area').length).toBe(0);
      });

      /* It no longer displays the error message */
      /*
      it('should display the error message', function(){
        var result = element.find('.error-area p');
        expect(result.length).toBe(1);

        var p = result[0];
        expect(_.trim(p.textContent)).toBe('blah');
      });
      */
    });

    describe('when an imageUri exists', function(){

      beforeEach(function(){
        isolateScope.model.imageUri = 'debug.html';
        isolateScope.$digest();
      });

      it('should display the thumbnail area', function(){
        expect(element.find('.thumbnail-area').length).toBe(1);
      });

      it('should not display the error area', function(){
        expect(element.find('.error-area').length).toBe(0);
      });

      it('should not display the updating area', function(){
        expect(element.find('.updating-area').length).toBe(0);
      });

      it('should not display the blank area', function(){
        expect(element.find('.blank-area').length).toBe(0);
      });

      it('should set the image source to the uri', function(){
        var result = element.find('.thumbnail-area img');
        expect(result.length).toBe(1);

        var img = result[0];
        expect(_.endsWith(img.src, isolateScope.model.imageUri)).toBeTruthy();
      });
    });
  });
});
