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

  describe('getValue', function(){
    it('should return the expected parts of an object', function(){
      var input = {
        a: {
          b: {
            c: 'c'
          }
        }
      };

      var result;

      result = utilities.getValue(input, 'a');
      expect(result).toBe(input.a);

      result = utilities.getValue(input, 'a.b');
      expect(result).toBe(input.a.b);

      result = utilities.getValue(input, 'a.b.c');
      expect(result).toBe(input.a.b.c);

      result = utilities.getValue(input, 'a.x.c');
      expect(result).toBeUndefined();

      result = utilities.getValue(input, 'z');
      expect(result).toBeUndefined();
    });
  });

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

    it('should return a generic error message if it a displayable error with not message', function(){
      var result = utilities.getFriendlyErrorMessage(new DisplayableError());
      expect(result).toBe(fifthweekConstants.unexpectedErrorText);
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
          scopeUtilities.getAccessor('primitive');
        }).toThrowError(FifthweekError);
      });

      it('should set root to the base object', function() {
        scope.base = {
          primitive: 'hello'
        };

        var result = scopeUtilities.getAccessor('base.primitive');

        expect(result.root).toBe(scope.base);
      });

      it('should set accessor to the accessor object', function() {
        scope.base = {
          primitive: 'hello'
        };

        var result = scopeUtilities.getAccessor('base.primitive');

        expect(result.accessor).toBe('primitive');
      });

      describe('when property is nested', function() {
        it('should set root to the base object', function() {
          scope.base = {
            base2: {
              primitive: 'hello'
            }
          };

          var result = scopeUtilities.getAccessor('base.base2.primitive');

          expect(result.root).toBe(scope.base.base2);
        });

        it('should set accessor to the accessor object', function() {
          scope.base = {
            base2: {
              primitive: 'hello'
            }
          };

          var result = scopeUtilities.getAccessor('base.base2.primitive');

          expect(result.accessor).toBe('primitive');
        });
      });
    });
  });

  describe('directive utilities', function() {

    var scope;
    var element;
    var attrs;
    var directiveUtilities;

    var itShouldSupportFlag = function(flagName, methodName, falseBecomesUndefined) {
      it('should set "' + flagName + '" to true if specified without value', function() {
        attrs[flagName] = '';

        directiveUtilities.scaffoldFormInput();

        expect(scope[flagName]).toBe(true);
        if (methodName) {
          expect(scope[methodName]()).toBe(true);
        }
      });

      it('should set "' + flagName + '" to true if specified with "true"', function() {
        attrs[flagName] = true;

        directiveUtilities.scaffoldFormInput();

        expect(scope[flagName]).toBe(true);
        if (methodName) {
          expect(scope[methodName]()).toBe(true);
        }
      });

      it('should set "' + flagName + '" to false if not specified', function() {
        directiveUtilities.scaffoldFormInput();

        if(falseBecomesUndefined){
          expect(scope[flagName]).toBeUndefined();
        }
        else{
          expect(scope[flagName]).toBe(false);
        }
        if (methodName) {
          expect(scope[methodName]()).toBe(false);
        }
      });

      it('should set "' + flagName + '" to false if specified with "false"', function() {
        attrs[flagName] = false;

        directiveUtilities.scaffoldFormInput();

        if(falseBecomesUndefined){
          expect(scope[flagName]).toBeUndefined();
        }
        else {
          expect(scope[flagName]).toBe(false);
        }
        if (methodName) {
          expect(scope[methodName]()).toBe(false);
        }
      });
    };

    beforeEach(function() {
      scope = {};
      element = {};
      attrs = {};
      directiveUtilities = utilities.forDirective(scope, element, attrs);
    });

    describe('scaffolding form input', function() {

      itShouldSupportFlag('showHelp');
      itShouldSupportFlag('focus', undefined, true);
      itShouldSupportFlag('required', 'isRequired');

      it('should evaluate isRequired as the value of the scope object if specified', function() {
        scope.a = { b: { c: true } };
        attrs.ngRequired = 'a.b.c';

        directiveUtilities.scaffoldFormInput();

        expect(scope.isRequired()).toBe(true);

        scope.a.b.c = false;

        expect(scope.isRequired()).toBe(false);
      });

      it('should evaluate isRequired as the value of the expression if specified', function() {
        scope.a = { b: { c: 'something' } };
        attrs.ngRequired = 'a.b.c === "something"';

        directiveUtilities.scaffoldFormInput();

        expect(scope.isRequired()).toBe(true);

        scope.a.b.c = 'someone';

        expect(scope.isRequired()).toBe(false);
      });

      it('should evaluate isDisabled as the value of the scope object if specified', function() {
        scope.a = { b: { c: true } };
        attrs.ngDisabled = 'a.b.c';

        directiveUtilities.scaffoldFormInput();

        expect(scope.isDisabled()).toBe(true);

        scope.a.b.c = false;

        expect(scope.isDisabled()).toBe(false);
      });

      it('should evaluate isDisabled as the value of the expression if specified', function() {
        scope.a = { b: { c: true } };
        attrs.ngDisabled = '!a.b.c';

        directiveUtilities.scaffoldFormInput();

        expect(scope.isDisabled()).toBe(false);

        scope.a.b.c = false;

        expect(scope.isDisabled()).toBe(true);
      });

      it('should set ngModel and ngModelAccessor if specified', function() {
        scope.a = { b: { c: true } };
        attrs.ngModel = 'a.b.c';

        directiveUtilities.scaffoldFormInput();

        expect(scope.ngModel).toBe(scope.a.b);
        expect(scope.ngModelAccessor).toBe('c');
      });

      it('should set not set ngModel and ngModelAccessor if not specified', function() {
        directiveUtilities.scaffoldFormInput();

        expect(scope.ngModel).toBeUndefined();
        expect(scope.ngModelAccessor).toBeUndefined();
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
        attrs.ngModel = 'a.b.c';

        directiveUtilities.scaffoldFormInput();

        expect(scope.inputId).toBe('a-b-c');
      });
    });
  });
});
