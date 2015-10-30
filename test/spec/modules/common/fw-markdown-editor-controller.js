describe('fw-markdown-editor-controller', function(){
  'use strict';

  var $q;
  var $scope;

  var markdownService;
  var target;

  beforeEach(function() {
    markdownService = jasmine.createSpyObj('markdownService', ['renderMarkdown', 'createMarkdown']);

    module('webApp');
    module(function ($provide) {
      $provide.value('markdownService', markdownService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwMarkdownEditorCtrl', { $scope: $scope });
    });
  };

  describe('when being created', function(){
    beforeEach(function(){
      createController();
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
        spyOn($scope, '$watch');
        target.initialize(ngModelCtrl);
      });

      it('should assign a render function', function(){
        expect(ngModelCtrl.$render).toBe(target.internal.render);
      });

      it('should set-up a watch on the html value', function(){
        expect($scope.$watch).toHaveBeenCalledWith('htmlValue', target.internal.setViewValue);
      });

      it('should assign ngModelCtrl', function(){
        expect(target.internal.ngModelCtrl).toBe(ngModelCtrl);
      });
    });

    describe('when calling render', function(){

      describe('when $viewValue is empty', function(){
        var ngModelCtrl;

        beforeEach(function() {
          ngModelCtrl = { $viewValue: '' };
          target.internal.ngModelCtrl = ngModelCtrl;

          target.internal.render();
        });

        it('should pass markdown to renderMarkdown', function(){
          expect(markdownService.renderMarkdown).not.toHaveBeenCalled();
        });

        it('should save rendered markdown to scope', function(){
          expect($scope.stValue).toBe('');
        });
      });

      describe('when $viewValue is undefined', function(){
        var ngModelCtrl;

        beforeEach(function() {
          ngModelCtrl = { $viewValue: undefined };
          target.internal.ngModelCtrl = ngModelCtrl;

          target.internal.render();
        });

        it('should pass markdown to renderMarkdown', function(){
          expect(markdownService.renderMarkdown).not.toHaveBeenCalled();
        });

        it('should save rendered markdown to scope', function(){
          expect($scope.stValue).toBe(undefined);
        });
      });

      describe('when $viewValue has value', function(){
        var ngModelCtrl;

        beforeEach(function() {
          ngModelCtrl = { $viewValue: 'view-value' };
          target.internal.ngModelCtrl = ngModelCtrl;

          markdownService.renderMarkdown.and.returnValue('html-value');
          target.internal.render();
        });

        it('should pass markdown to renderMarkdown', function(){
          expect(markdownService.renderMarkdown).toHaveBeenCalledWith('view-value');
        });

        it('should save rendered markdown to scope', function(){
          expect($scope.stValue).toBe('html-value');
        });
      });
    });

    describe('when calling setViewValue', function(){
      var ngModelCtrl;

      beforeEach(function(){
        spyOn(target.internal, 'setValidity');
        ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
        target.internal.ngModelCtrl = ngModelCtrl;
      });

      describe('when htmlValue is empty', function(){
        beforeEach(function(){
          $scope.stValue = '';
          target.internal.setViewValue();
        });

        it('should not call createMarkdown', function(){
          expect(markdownService.createMarkdown).not.toHaveBeenCalled();
        });

        it('should call $setViewValue', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith('');
        });

        it('should call setValidity', function(){
          expect(target.internal.setValidity).toHaveBeenCalledWith('');
        });
      });

      describe('when htmlValue is undefined', function(){
        beforeEach(function(){
          $scope.stValue = undefined;
          target.internal.setViewValue();
        });

        it('should not call createMarkdown', function(){
          expect(markdownService.createMarkdown).not.toHaveBeenCalled();
        });

        it('should call $setViewValue', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(undefined);
        });

        it('should call setValidity', function(){
          expect(target.internal.setValidity).toHaveBeenCalledWith('');
        });
      });

      describe('when htmlValue has content', function(){
        beforeEach(function(){
          $scope.stValue = 'html-value';
          markdownService.createMarkdown.and.returnValue('markdown-value');
          target.internal.setViewValue();
        });

        it('should not call createMarkdown', function(){
          expect(markdownService.createMarkdown).toHaveBeenCalledWith('html-value');
        });

        it('should call $setViewValue', function(){
          expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith('markdown-value');
        });

        it('should call setValidity', function(){
          expect(target.internal.setValidity).toHaveBeenCalledWith('markdown-value');
        });
      });
    });

    describe('when calling setValidity', function(){
      var ngModelCtrl;

      beforeEach(function(){
        ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setValidity']);
        target.internal.ngModelCtrl = ngModelCtrl;
      });

      describe('when maxlength is not specified and required is not specified', function(){
        beforeEach(function(){
          $scope.maxlength = undefined;
          $scope.ngRequired = undefined;
          target.internal.setValidity('markdown-value');
        });

        it('should not call $setValidity', function(){
          expect(ngModelCtrl.$setValidity).not.toHaveBeenCalled();
        });
      });

      describe('when maxlength is specified', function(){
        describe('when maxlength is exceeded', function(){
          beforeEach(function(){
            $scope.maxlength = 13;
            $scope.ngRequired = undefined;
            target.internal.setValidity('markdown-value');
          });

          it('should call $setValidity for maxLength', function(){
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('maxlength', false);
          });
        });

        describe('when maxlength is not exceeded', function(){
          beforeEach(function(){
            $scope.maxlength = 14;
            $scope.ngRequired = undefined;
            target.internal.setValidity('markdown-value');
          });

          it('should call $setValidity for maxLength', function(){
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('maxlength', true);
          });
        });
      });

      describe('when required is specified', function(){
        describe('when required is not satisfied', function(){
          beforeEach(function(){
            $scope.maxlength = undefined;
            $scope.ngRequired = true;
            target.internal.setValidity('');
          });

          it('should call $setValidity for required', function(){
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('required', false);
          });
        });

        describe('when required is satisfied', function(){
          beforeEach(function(){
            $scope.maxlength = undefined;
            $scope.ngRequired = true;
            target.internal.setValidity('markdown-value');
          });

          it('should call $setValidity for required', function(){
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('required', true);
          });
        });
      });
    });
  });
});
