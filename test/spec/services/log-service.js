describe('log service', function() {
  'use strict';

  var $rootScope;
  var $httpBackend;
  var fifthweekConstants;
  var log;
  var logService;

  beforeEach(function() {
    log = {
      debug: function () {},
      info: function () {},
      warn: function () {},
      error: function () {}
    };

    var $window = {
      location:{
        href: '/test'
      }
    };

    module('webApp');
    module(function($provide) {
      $provide.value('$log', log);
      $provide.value('$window', $window);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      fifthweekConstants = $injector.get('fifthweekConstants');
      logService = $injector.get('logService');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var testLogToServer = function(level, call){

    var message = { test: 'test' };
    var logMessage = { level: level, payload: { url: '/test', message: message } };

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', logMessage).respond(200, 'Success');

    call(message);

    $httpBackend.flush();
    $rootScope.$apply();
  };

  it('should call the fifthweek API with debug level when requested to log debug', function(){
    testLogToServer('debug', function(message) { logService.debug(message); });
  });

  it('should call the fifthweek API with info level when requested to log info', function(){
    testLogToServer('info', function(message) { logService.info(message); });
  });

  it('should call the fifthweek API with warn level when requested to log warn', function(){
    testLogToServer('warn', function(message) { logService.warn(message); });
  });

  it('should call the fifthweek API with error level when requested to log error', function(){
    testLogToServer('error', function(message) { logService.error(message); });
  });

  it('should not call the fifthweek API when requested to log an API error', function(){
    spyOn(log, 'info');
    logService.error(new ApiError('Test'));
    expect(log.info).toHaveBeenCalledWith('Test');
  });

  it('should not call the fifthweek API when requested to log an input validation error', function(){
    spyOn(log, 'info');
    logService.error(new InputValidationError('Test'));
    expect(log.info).toHaveBeenCalledWith('Test');
  });

  it('should log an error if the fifthweek API call fails', function(){

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log').respond(500, 'Failure');

    spyOn(log, 'warn');

    logService.warn('test');

    $httpBackend.flush();
    $rootScope.$apply();

    expect(log.warn).toHaveBeenCalled();
  });

  it('should call the fifthweek API with error level when an unhandled error occurs with an exception', function(){
    var exception = 'exception';
    var logMessage = { level: 'error', payload: { url: '/test', message: { exception: exception } } };

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', logMessage).respond(200, 'Success');

    logService.logUnhandledError(exception, undefined);

    $httpBackend.flush();
    $rootScope.$apply();
  });

  it('should call the fifthweek API with error level when an unhandled error occurs with an exception and cause', function(){
    var exception = 'exception';
    var cause = 'cause';
    var logMessage = { level: 'error', payload: { url: '/test', message: { exception: exception, cause: cause } } };

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', logMessage).respond(200, 'Success');

    logService.logUnhandledError(exception, cause);

    $httpBackend.flush();
    $rootScope.$apply();
  });

  it('should call the fifthweek API with error level when an unhandled error occurs with a cause', function(){
    var cause = 'cause';
    var logMessage = { level: 'error', payload: { url: '/test', message: { cause: cause } } };

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', logMessage).respond(200, 'Success');

    logService.logUnhandledError(undefined, cause);

    $httpBackend.flush();
    $rootScope.$apply();
  });

  it('should not call the fifthweek API when an unhandled error occurs with no exception or cause', function(){
    logService.logUnhandledError(undefined, undefined);
    $rootScope.$apply();
  });

  it('should return false from shouldLog if the payload is undefined', function()
  {
    expect(logService.shouldLog(undefined)).toBeFalsy();
  });

  it('should return false from shouldLog if the payload is empty', function()
  {
    expect(logService.shouldLog({})).toBeFalsy();
  });

  it('should return true from shouldLog if the payload is not empty or undefined', function()
  {
    expect(logService.shouldLog({ x: 1 })).toBeTruthy();
  });
});
