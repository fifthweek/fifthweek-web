describe('fw-submit-feedback-button directive', function(){
  'use strict';

  var $q;
  var $rootScope;
  var $compile;

  var $modal;
  var fwSubmitFeedbackButtonConstants;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    $modal = jasmine.createSpyObj('$modal', ['open']);

    module(function($provide) {
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      fwSubmitFeedbackButtonConstants = $injector.get('fwSubmitFeedbackButtonConstants');
    });
  });

  describe('when creating', function(){
    var scope;
    var element;
    var isolateScope;

    var expectedTitle;
    var expectedCallToAction;

    var runTests = function(){
      it('should set the expected call to action', function(){
        expect(isolateScope.callToAction).toBe(expectedCallToAction);
      });

      describe('when click is called', function(){
        var result;
        beforeEach(function(){
          $modal.open.and.returnValue({ result: 'result' });
          result = isolateScope.click();
          scope.$apply();
        });

        it('should open the dialog', function(){
          expect($modal.open).toHaveBeenCalled();
        });

        it('should specify the controller', function(){
          expect($modal.open.calls.first().args[0].controller).toBe('submitFeedbackDialogCtrl');
        });

        it('should specify the template', function(){
          expect($modal.open.calls.first().args[0].templateUrl).toBe('modules/information/submit-feedback-dialog.html');
        });

        it('should specify the size', function(){
          expect($modal.open.calls.first().args[0].size).toBe('sm');
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });
    };

    describe('when attributes are not specified', function(){
      beforeEach(function(){
        expectedTitle = fwSubmitFeedbackButtonConstants.defaultTitle;
        expectedCallToAction = fwSubmitFeedbackButtonConstants.defaultCallToAction;

        scope = $rootScope.$new();

        element = angular.element('<fw-submit-feedback-button></fw-submit-feedback-button>');
        $compile(element)(scope);
        scope.$digest();
        isolateScope = element.isolateScope();
      });

      runTests();
    });

    describe('when attributes are specified', function(){
      beforeEach(function(){
        expectedTitle = 'a';
        expectedCallToAction = 'c';

        scope = $rootScope.$new();

        element = angular.element('<fw-submit-feedback-button title="a" call-to-action="c"></fw-submit-feedback-button>');
        $compile(element)(scope);
        scope.$digest();
        isolateScope = element.isolateScope();
      });

      runTests();
    });
  });
});
