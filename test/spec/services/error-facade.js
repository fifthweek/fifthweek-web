describe('error facade', function() {
  'use strict';

  var setMessage;

  var utilities;
  var logService;
  var target;

  beforeEach(function() {
    utilities = jasmine.createSpyObj('utilities', [ 'getFriendlyErrorMessage' ]);
    logService = jasmine.createSpyObj('logService', [ 'error' ]);
    setMessage = jasmine.createSpy('setMessage');

    module('webApp');
    module(function($provide) {
      $provide.value('utilities', utilities);
      $provide.value('logService', logService);
    });

    inject(function($injector) {
      target = $injector.get('errorFacade');
    });
  });

  it('should perform no operation with cancellation errors', function() {
    var result = target.handleError(new CancellationError(), setMessage);

    expect(setMessage).not.toHaveBeenCalled();
    expect(logService.error).not.toHaveBeenCalled();
    expect(result).not.toBeUndefined();
  });

  it('should set the error returned from the utility method', function() {
    utilities.getFriendlyErrorMessage.and.returnValue('friendly error');

    target.handleError('error', setMessage);

    expect(utilities.getFriendlyErrorMessage).toHaveBeenCalledWith('error');
    expect(setMessage).toHaveBeenCalledWith('friendly error');
  });

  it('should log the error', function() {
    logService.error.and.returnValue('result');

    var result = target.handleError('error', setMessage);

    expect(result).toBe('result');
    expect(logService.error).toHaveBeenCalledWith('error');
  });
});
