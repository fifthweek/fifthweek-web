describe('fw-file-upload directive', function(){
  'use strict';

  var $rootScope;
  var $compile;
  var $q;

  var scope;
  var isolateScope;
  var element;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fileUploadCtrl', function() { return {}; });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
    });

    scope = $rootScope.$new();
    element = angular.element('<fw-file-upload></fw-file-upload>');
    $compile(element)(scope);
    scope.$digest();

    isolateScope = element.isolateScope();
    isolateScope.model = { progress: 0 };
  });

  describe('when the File API is not supported', function(){

    beforeEach(function(){
      isolateScope.model.fileApiSupported = false;
      isolateScope.$digest();
    });

    it('should display a not supported area', function(){
      expect(element.find('#file-upload-not-supported-area').length).toBe(1);
    });

    it('should not display the button area', function(){
      expect(element.find('#file-upload-button-area').length).toBe(0);
    });

    it('should not display the progress area', function(){
      expect(element.find('#file-upload-progress-area').length).toBe(0);
    });

    it('should not display the error area', function(){
      expect(element.find('#file-upload-error-area').length).toBe(0);
    });
  });

  describe('when the File API is supported', function(){

    beforeEach(function(){
      isolateScope.model.fileApiSupported = true;
      isolateScope.$digest();
    });

    it('should not display the not supported area', function(){
      expect(element.find('#file-upload-not-supported-area').length).toBe(0);
    });

    it('should display the button area', function(){
      expect(element.find('#file-upload-button-area').length).toBe(1);
    });

    it('should not display the progress area', function(){
      expect(element.find('#file-upload-progress-area').length).toBe(0);
    });

    it('should not display the error area', function(){
      expect(element.find('#file-upload-error-area').length).toBe(0);
    });

    it('should display Upload in the button', function(){
      var result = element.find('#file-upload-button-area span');
      expect(result.length).toBe(1);

      var button = result[0];
      expect(_.trim(button.textContent)).toBe('Upload');
    });

    describe('when description is specified', function(){

      beforeEach(function(){
        isolateScope.description = 'description-value';
        isolateScope.$digest();
      });

      it('should display the description in the button', function(){
        var result = element.find('#file-upload-button-area span');
        var button = result[0];
        expect(_.trim(button.textContent)).toBe('description-value');
      });
    });

    it('should not have any accept criteria on the file upload control', function(){
      var result = element.find('#file-upload-button-area input');
      expect(result.length).toBe(1);

      var input = result[0];
      expect(input.accept).toBe('');
    });

    describe('when accept is specified', function(){

      beforeEach(function(){
        isolateScope.accept = 'accept-value';
        isolateScope.$digest();
      });

      it('should display the description in the button', function(){
        var result = element.find('#file-upload-button-area input');
        var input = result[0];
        expect(input.accept).toBe('accept-value');
      });
    });

    describe('when submitting', function(){

      beforeEach(function(){
        isolateScope.model.isSubmitting = true;
        isolateScope.$digest();
      });

      it('should not display the not supported area', function(){
        expect(element.find('#file-upload-not-supported-area').length).toBe(0);
      });

      it('should not display the button area', function(){
        expect(element.find('#file-upload-button-area').length).toBe(0);
      });

      it('should display the progress area', function(){
        expect(element.find('#file-upload-progress-area').length).toBe(1);
      });

      it('should not display the error area', function(){
        expect(element.find('#file-upload-error-area').length).toBe(0);
      });

      it('should have zero progress', function(){
        var result = element.find('#file-upload-progress-area .progress-bar');
        expect(result.length).toBe(1);

        var progress = result[0];
        expect(progress.style.cssText).toContain('width: 0%');
      });

      describe('when progress is specified', function(){

        beforeEach(function(){
          isolateScope.model.progress = 33;
          isolateScope.$digest();
        });

        it('should have the specified progress', function(){
          var result = element.find('#file-upload-progress-area .progress-bar');
          expect(result.length).toBe(1);

          var progress = result[0];
          expect(progress.style.cssText).toContain('width: 33%;');
        });
      });

      describe('when an error message exists', function(){

        beforeEach(function(){
          isolateScope.model.errorMessage = true;
          isolateScope.$digest();
        });

        it('should not display the not supported area', function(){
          expect(element.find('#file-upload-not-supported-area').length).toBe(0);
        });

        it('should not display the button area', function(){
          expect(element.find('#file-upload-button-area').length).toBe(0);
        });

        it('should display the progress area', function(){
          expect(element.find('#file-upload-progress-area').length).toBe(1);
        });

        it('should display the error area', function(){
          expect(element.find('#file-upload-error-area').length).toBe(1);
        });
      });

    });

    describe('when an error message exists', function(){

      beforeEach(function(){
        isolateScope.model.errorMessage = true;
        isolateScope.$digest();
      });

      it('should not display the not supported area', function(){
        expect(element.find('#file-upload-not-supported-area').length).toBe(0);
      });

      it('should display the button area', function(){
        expect(element.find('#file-upload-button-area').length).toBe(1);
      });

      it('should not display the progress area', function(){
        expect(element.find('#file-upload-progress-area').length).toBe(0);
      });

      it('should display the error area', function(){
        expect(element.find('#file-upload-error-area').length).toBe(1);
      });
    });
  });
});
