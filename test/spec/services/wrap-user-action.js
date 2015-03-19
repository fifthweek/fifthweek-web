describe('wrap user action', function() {
  'use strict';

  var eventTitle = 'event title';
  var eventCategory = 'event category';

  var action;
  var actionMetadata;

  var $q;
  var $rootScope;
  var analytics;
  var errorFacade;
  var target;

  beforeEach(function() {
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleErrorInBackground']);
    analytics = jasmine.createSpyObj('analytics', [ 'eventTrack' ]);
    action = jasmine.createSpy('action');
    actionMetadata = {
      eventTitle: eventTitle,
      eventCategory: eventCategory
    };

    module('webApp');
    module(function($provide) {
      $provide.value('errorFacade', errorFacade);
      $provide.value('analytics', analytics);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      errorFacade = $injector.get('errorFacade');
      target = $injector.get('wrapUserAction');
    });

    analytics.eventTrack.and.returnValue($q.when());
  });

  it('should call the action', function() {
    target(action, actionMetadata);
    $rootScope.$apply();

    expect(action).toHaveBeenCalled();
  });

  it('should return nothing on successful invocations', function() {
    action.and.returnValue('do not return this');
    analytics.eventTrack.and.returnValue($q.when('do not return this either'));

    var continuation = jasmine.createSpy('continuation');
    target(action, actionMetadata).then(continuation);
    $rootScope.$apply();

    expect(continuation).toHaveBeenCalledWith(undefined);
  });

  it('should track successful invocations if tracking information has been provided', function() {
    target(action, actionMetadata);
    $rootScope.$apply();

    expect(analytics.eventTrack).toHaveBeenCalledWith(eventTitle, eventCategory);
    analytics.eventTrack.calls.reset();

    target(action);
    $rootScope.$apply();

    expect(analytics.eventTrack).not.toHaveBeenCalled();
  });

  it('should not track unsuccessful invocations if tracking information has been provided', function() {
    action.and.returnValue($q.reject());

    target(action, actionMetadata);
    $rootScope.$apply();

    expect(analytics.eventTrack).not.toHaveBeenCalled();
  });

  describe('when handling errors', function() {
    var error = new Error('bad');

    afterEach(function() {
      errorFacade.handleErrorInBackground.and.returnValue('error message');

      var continuation = jasmine.createSpy('continuation');
      target(action, actionMetadata).then(continuation);
      $rootScope.$apply();

      expect(continuation).toHaveBeenCalledWith('error message');
      expect(errorFacade.handleErrorInBackground).toHaveBeenCalledWith(error);
    });

    it('should return an error message on synchronous failures', function() {
      action.and.throwError(error);
    });

    it('should return an error message on asynchronous failures', function() {
      action.and.returnValue($q.reject(error));
    });
  });
});
