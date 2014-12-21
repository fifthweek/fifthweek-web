describe('utilities', function() {
  'use strict';

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
  });

  describe('when getting a friendly error message', function(){

    it('should return the message in the error if it is an API error', function(){
      var result = utilities.getFriendlyErrorMessage(new ApiError('test'));
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

  // load the service's module
  beforeEach(module('webApp'));

  var fifthweekConstants;
  var utilities;

  beforeEach(inject(function($injector) {
    fifthweekConstants = $injector.get('fifthweekConstants');
    utilities = $injector.get('utilities');
  }));
});