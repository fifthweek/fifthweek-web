describe('log service', function() {
  'use strict';

  it('should call the fifthweek API when requested to log', function(){

    var payload = { test: 'test' };
    var logMessage = { level: 'info', payload: payload };

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', logMessage).respond(200, 'Success');

    logService.log('info', payload);

    $httpBackend.flush();
    $rootScope.$apply();
  });

  it('should log an error if the fifthweek API call fails', function(){

    var payload = { test: 'test' };
    var logMessage = { level: 'warn', payload: payload };

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', logMessage).respond(500, 'Failure');

    spyOn(log, 'warn');

    logService.log('warn', payload);

    $httpBackend.flush();
    $rootScope.$apply();

    expect(log.warn).toHaveBeenCalled();
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

  // load the service's module
  beforeEach(module('webApp'));

  var $rootScope;
  var $httpBackend;
  var fifthweekConstants;
  var log;
  var logService;

  beforeEach(function() {
    log = { warn: function(){} };

    module(function($provide) {
      $provide.value('$log', log);
    });
  });

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    fifthweekConstants = $injector.get('fifthweekConstants');
    logService = $injector.get('logService');
  }));
});
