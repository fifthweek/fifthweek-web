describe('fw-register-interest-button directive', function(){
  'use strict';

  var $q;
  var $rootScope;
  var $compile;

  var $modal;
  var fwRegisterInterestButtonConstants;

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
      fwRegisterInterestButtonConstants = $injector.get('fwRegisterInterestButtonConstants');
    });
  });

  describe('when creating', function(){
    var scope;
    var element;
    var isolateScope;

    var expectedTitle;
    var expectedMessage;
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
          expect($modal.open.calls.first().args[0].controller).toBe('registerInterestDialogCtrl');
        });

        it('should specify the template', function(){
          expect($modal.open.calls.first().args[0].templateUrl).toBe('modules/information/register-interest-dialog.html');
        });

        it('should specify the size', function(){
          expect($modal.open.calls.first().args[0].size).toBe('sm');
        });

        it('should resolve the title to the expected title', function(){
          expect($modal.open.calls.first().args[0].resolve.title()).toBe(expectedTitle);
        });

        it('should resolve the message to the expected message', function(){
          expect($modal.open.calls.first().args[0].resolve.message()).toBe(expectedMessage);
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });
    };

    describe('when attributes are not specified', function(){
      beforeEach(function(){
        expectedTitle = fwRegisterInterestButtonConstants.defaultTitle;
        expectedMessage = fwRegisterInterestButtonConstants.defaultMessage;
        expectedCallToAction = fwRegisterInterestButtonConstants.defaultCallToAction;

        scope = $rootScope.$new();

        element = angular.element('<fw-register-interest-button></fw-register-interest-button>');
        $compile(element)(scope);
        scope.$digest();
        isolateScope = element.isolateScope();
      });

      runTests();
    });

    describe('when attributes are specified', function(){
      beforeEach(function(){
        expectedTitle = 'a';
        expectedMessage = 'b';
        expectedCallToAction = 'c';

        scope = $rootScope.$new();

        element = angular.element('<fw-register-interest-button title="a" message="b" call-to-action="c"></fw-register-interest-button>');
        $compile(element)(scope);
        scope.$digest();
        isolateScope = element.isolateScope();
      });

      runTests();
    });
  });
});
