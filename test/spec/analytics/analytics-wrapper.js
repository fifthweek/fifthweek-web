describe('analytics wrapper', function(){
  'use strict';

  beforeEach(module('webApp'));

  var target;
  var $q;
  var $rootScope;
  var $analytics;
  var logService;
  var analyticsEventFlatMap;

  beforeEach(function() {
    $analytics = jasmine.createSpyObj('$analytics', ['eventTrack', 'setUsername']);
    logService = jasmine.createSpyObj('logService', ['error']);
    analyticsEventFlatMap = jasmine.createSpy('analyticsEventFlatMap');

    module(function($provide) {
      $provide.value('$analytics', $analytics);
      $provide.value('logService', logService);
      $provide.value('analyticsEventFlatMap', analyticsEventFlatMap);
    });
  });

  beforeEach(inject(function($injector) {
    target = $injector.get('analytics');
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
  }));

  it('should forward on the eventTrack method', function(){

    analyticsEventFlatMap.and.returnValue([{eventTitle: 'X', eventCategory: 'Y'}]);

    target.eventTrack('title', 'eventCategory');

    expect(analyticsEventFlatMap).toHaveBeenCalledWith('title', 'eventCategory');
    expect($analytics.eventTrack).toHaveBeenCalledWith('X', { category: 'Y' });
  });

  it('should support multiple expanded events', function(){

    analyticsEventFlatMap.and.returnValue([{eventTitle: 'X', eventCategory: 'Y'}, {eventTitle: 'A', eventCategory: 'B'}]);

    target.eventTrack('title', 'eventCategory');

    expect(analyticsEventFlatMap).toHaveBeenCalledWith('title', 'eventCategory');
    expect($analytics.eventTrack).toHaveBeenCalledWith('X', { category: 'Y' });
    expect($analytics.eventTrack).toHaveBeenCalledWith('A', { category: 'B' });
  });

  it('should log and absorb thrown errors from the eventTrack method', function(){

    analyticsEventFlatMap.and.returnValue([{eventTitle: 'X', eventCategory: 'Y'}]);
    $analytics.eventTrack = function() { throw 'error'; };

    var catchResult;
    target.eventTrack('title', 'eventCategory').catch(function(error) { catchResult = error; });

    expect(logService.error).toHaveBeenCalledWith('error');
    expect(catchResult).toBeUndefined();
  });

  it('should log and absorb rejected promises from the eventTrack method', function(){

    analyticsEventFlatMap.and.returnValue([{eventTitle: 'X', eventCategory: 'Y'}]);
    $analytics.eventTrack = function() { return $q.reject('error'); };

    var catchResult;
    target.eventTrack('title', 'eventCategory').catch(function(error) { catchResult = error; });

    $rootScope.$apply();

    expect(logService.error).toHaveBeenCalledWith('error');
    expect(catchResult).toBeUndefined();
  });

  it('should forward on the setUsername method', function(){

    target.setUsername('username');

    expect($analytics.setUsername).toHaveBeenCalledWith('username');
  });

  it('should log and absorb thrown errors from the setUsername method', function(){

    $analytics.setUsername = function() { throw 'error'; };

    var catchResult;
    target.setUsername('username').catch(function(error) { catchResult = error; });

    expect(logService.error).toHaveBeenCalledWith('error');
    expect(catchResult).toBeUndefined();
  });

  it('should log and absorb rejected promises from the setUsername method', function(){

    $analytics.setUsername = function() { return $q.reject('error'); };

    var catchResult;
    target.setUsername('username').catch(function(error) { catchResult = error; });

    $rootScope.$apply();

    expect(logService.error).toHaveBeenCalledWith('error');
    expect(catchResult).toBeUndefined();
  });
});
