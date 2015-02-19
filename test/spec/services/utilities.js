describe('utilities', function() {
  'use strict';

  var fifthweekConstants;
  var utilities;

  // load the service's module
  beforeEach(module('webApp'));

  beforeEach(inject(function($injector) {
    fifthweekConstants = $injector.get('fifthweekConstants');
    utilities = $injector.get('utilities');
  }));

  describe('when getting an HTTP error', function(){

    it('should return a connection error if the status code is zero', function(){
      var error = utilities.getHttpError({ status: 0 });
      expect(error instanceof ConnectionError).toBeTruthy();
    });

    it('should return an API error if the status code is non-zero', function(){
      var error = utilities.getHttpError({ status: 500 });
      expect(error instanceof ApiError).toBeTruthy();
      expect(error.message).toBe(fifthweekConstants.unexpectedErrorText);
    });

    it('should return an API error with message if a standard error message is supplied', function(){
      var error = utilities.getHttpError({ status: 500, data: { message: 'test' } });
      expect(error instanceof ApiError).toBeTruthy();
      expect(error.message).toBe('test');
    });

    it('should return an API error with message if an OAuth error message is supplied', function(){
      var error = utilities.getHttpError({ status: 500, data: { error_description: 'test' } });
      expect(error instanceof ApiError).toBeTruthy();
      expect(error.message).toBe('test');
    });

    it('should return an unauthenticated on 401', function(){
      var error = utilities.getHttpError({ status: 401 });
      expect(error instanceof UnauthenticatedError).toBeTruthy();
      expect(error.message).toBe('Not authenticated.');
    });

    it('should return an unauthorized on 403', function(){
      var error = utilities.getHttpError({ status: 403 });
      expect(error instanceof UnauthorizedError).toBeTruthy();
      expect(error.message).toBe('Not authorized.');
    });
  });

  describe('when getting a friendly error message', function(){

    it('should return the message in the error if it is an API error', function(){
      var result = utilities.getFriendlyErrorMessage(new ApiError('test'));
      expect(result).toBe('test');
    });

    it('should return the message in the error if it is an input validation error', function(){
      var result = utilities.getFriendlyErrorMessage(new InputValidationError('test'));
      expect(result).toBe('test');
    });

    it('should return the message in the error if it a displayable error', function(){
      var result = utilities.getFriendlyErrorMessage(new DisplayableError('test', 'description'));
      expect(result).toBe('test');
    });

    it('should return a connection error message if it is a connection error', function(){
      var result = utilities.getFriendlyErrorMessage(new ConnectionError('test'));
      expect(result).toBe(fifthweekConstants.connectionErrorText);
    });

    it('should return a generic error message if it is general error', function(){
      var result = utilities.getFriendlyErrorMessage(new Error('test'));
      expect(result).toBe(fifthweekConstants.unexpectedErrorText);
    });

    it('should return a generic error message if it is not an error object', function(){
      var result = utilities.getFriendlyErrorMessage('test');
      expect(result).toBe(fifthweekConstants.unexpectedErrorText);
    });
  });

  describe('scope utilities', function() {

    var scope;
    var scopeUtilities;

    beforeEach(function() {
      scope = {};
      scopeUtilities = utilities.forScope(scope);
    });

    describe('defining the model accessor', function() {

      it('should throw an error if model is primitive', function() {
        expect(function() {
          scopeUtilities.defineModelAccessor({
            ngModel: 'primitive'
          });
        }).toThrowError(FifthweekError);
      });

      it('should set ngModel to the base object', function() {
        scope.base = {
          primitive: 'hello'
        };

        scopeUtilities.defineModelAccessor({
          ngModel: 'base.primitive'
        });

        expect(scope.ngModel).toBe(scope.base);
      });

      it('should set ngModelAccessor to the accessor object', function() {
        scope.base = {
          primitive: 'hello'
        };

        scopeUtilities.defineModelAccessor({
          ngModel: 'base.primitive'
        });

        expect(scope.ngModelAccessor).toBe('primitive');
      });
    });
  });

  describe('directive utilities', function() {

    var scope;
    var element;
    var attrs;
    var directiveUtilities;

    beforeEach(function() {
      scope = {};
      element = {};
      attrs = {
        ngModel: 'some.binding'
      };
      directiveUtilities = utilities.forDirective(scope, element, attrs);
    });

    describe('scaffolding form input', function() {

      it('should set "required" to true if specified without value', function() {
        attrs.required = '' ;

        directiveUtilities.scaffoldFormInput();

        expect(scope.required).toBe(true);
      });

      it('should set "required" to true if specified with "true"', function() {
        attrs.required = true ;

        directiveUtilities.scaffoldFormInput();

        expect(scope.required).toBe(true);
      });

      it('should set "required" to false if not specified', function() {
        directiveUtilities.scaffoldFormInput();

        expect(scope.required).toBe(false);
      });

      it('should set "required" to false if specified with "false"', function() {
        attrs.required = false ;

        directiveUtilities.scaffoldFormInput();

        expect(scope.required).toBe(false);
      });


      it('should set "focus" to true if specified without value', function() {
        attrs.focus = '' ;

        directiveUtilities.scaffoldFormInput();

        expect(scope.focus).toBe(true);
      });

      it('should set "focus" to true if specified with "true"', function() {
        attrs.focus = true ;

        directiveUtilities.scaffoldFormInput();

        expect(scope.focus).toBe(true);
      });

      it('should set "focus" to false if not specified', function() {
        directiveUtilities.scaffoldFormInput();

        expect(scope.focus).toBe(false);
      });

      it('should set "focus" to false if specified with "false"', function() {
        attrs.focus = false ;

        directiveUtilities.scaffoldFormInput();

        expect(scope.focus).toBe(false);
      });

      it('should set "placeholder" straight from attribute', function() {
        attrs.placeholder = 'hello';

        directiveUtilities.scaffoldFormInput();

        expect(scope.placeholder).toBe('hello');
      });

      it('should set "breakpoint" straight from attribute if specified', function() {
        attrs.breakpoint = 'xxxxs';

        directiveUtilities.scaffoldFormInput();

        expect(scope.breakpoint).toBe('xxxxs');
      });

      it('should set "breakpoint" to "sm" if not specified', function() {
        directiveUtilities.scaffoldFormInput();

        expect(scope.breakpoint).toBe('sm');
      });

      it('should set "inputId" to kebab-cased equivalent of ngModel', function() {
        directiveUtilities.scaffoldFormInput();

        expect(scope.inputId).toBe('some-binding');
      });
    });
  });
});
