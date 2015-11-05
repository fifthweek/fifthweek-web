describe('aggregate user state factory', function() {
  'use strict';

  var aggregateUserStateImpl;
  var $injector;

  beforeEach(function(){
    aggregateUserStateImpl = jasmine.createSpyObj('aggregateUserStateImpl', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('aggregateUserStateImpl', aggregateUserStateImpl);
    });

    inject(function(_$injector_) {
      $injector = _$injector_;
    });
  });

  it('should initialize the authentication service', function(){
    var target = $injector.get('aggregateUserState');

    expect(target.initialize).toHaveBeenCalled();
  });

  it('should return the authentication service', function(){
    var target = $injector.get('aggregateUserState');

    expect(target).toBe(aggregateUserStateImpl);
  });
});

describe('aggregate user state', function() {
  'use strict';

  var userId = 'userId';
  var userId2 = 'userId2';
  var originalUserState;
  var updatedUserState;
  var fetchedUserState;
  var fetchedUserStateMapped;
  var delta;
  var deltaKey = 'some';
  var localStorageKey = 'aggregateUserState';

  var $q;

  var $rootScope;
  var localStorageService;
  var aggregateUserStateConstants;
  var fetchAggregateUserStateConstants;
  var authenticationServiceConstants;
  var authenticationService;
  var target;

  beforeEach(function() {
    delta = { complex: 'ooh', foo: 'ahh' };
    originalUserState = { userId: userId, some: { complex: 'object' }, unchanged: true};
    updatedUserState = { userId: userId, some: { complex: 'ooh', foo: 'ahh' }, unchanged: true};
    fetchedUserState = { some: { complex: 'hello' }, different: true, accessSignatures: { signature: 10 }};
    fetchedUserStateMapped = { userId: userId2, some: { complex: 'hello' }, different: true };

    module('webApp');
    module(function($provide) {
      localStorageService = jasmine.createSpyObj('localStorageService', ['get', 'set']);
      authenticationService = { currentUser:{} };

      $provide.value('localStorageService', localStorageService);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      fetchAggregateUserStateConstants = $injector.get('fetchAggregateUserStateConstants');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
      target = $injector.get('aggregateUserStateImpl');
    });
  });

  describe('pre initialization', function() {
    it('should contain undefined user state by default', function() {
      expect(target.currentValue).toBeUndefined();
      expect(target.isCurrentValueStale).toEqual(true);
    });

    it('should perform no operation when setting deltas', function() {
      target.setDelta(userId, deltaKey, delta);
      expect(target.currentValue).toBeUndefined();
      expect(target.isCurrentValueStale).toEqual(true);
    });
  });

  describe('during initialization', function() {
    it('it should restore state from local storage', function() {
      localStorageService.get.and.returnValue(_.cloneDeep(originalUserState));

      target.initialize();

      expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
      expect(target.currentValue).toEqual(originalUserState);
      expect(target.isCurrentValueStale).toEqual(true);
    });
  });

  describe('post initialization', function() {
    beforeEach(function() {
      localStorageService.get.and.returnValue(_.cloneDeep(originalUserState));
      target.initialize();
    });

    it('should throw an error when initializing a subsequent time', function() {
      expect(function() {
        target.initialize();
      }).toThrowError(FifthweekError);
    });

    it('should perform no operation when setting deltas against a different user', function() {
      target.setDelta(userId2, deltaKey, delta);

      expect(target.currentValue).toEqual(originalUserState);
      expect(target.isCurrentValueStale).toEqual(true);
    });

    describe('when setting deltas for the current user', function() {
      beforeEach(function(){
        target.isCurrentValueStale = true;
      });

      it('should update the state', function() {
        target.setDelta(userId, deltaKey, delta);

        expect(target.currentValue).toEqual(updatedUserState);
        expect(target.isCurrentValueStale).toEqual(false);
      });

      it('should broadcast an event', function() {
        spyOn($rootScope, '$broadcast').and.callThrough();

        target.setDelta(userId, deltaKey, delta);

        expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, updatedUserState);
      });
    });

    describe('when handling a "current user changed" event', function() {
      beforeEach(function(){
        target.isCurrentValueStale = false;
      });

      it('should perform no operation if user has not changed', function() {
        $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, {userId: userId});
        $rootScope.$apply();

        expect(target.currentValue).toEqual(originalUserState);
        expect(target.isCurrentValueStale).toEqual(false);
      });

      describe('and user really has changed', function() {
        it('should set the user state to stale', function() {
          $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, {userId: userId2});
          $rootScope.$apply();

          expect(target.currentValue).toEqual(originalUserState);
          expect(target.isCurrentValueStale).toEqual(true);
        });

        it('should broadcast an event', function() {
          spyOn($rootScope, '$broadcast').and.callThrough();

          $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, {userId: userId2});
          $rootScope.$apply();

          expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, undefined);
        });
      });
    });

    describe('when handling a "whole state fetched from server" event', function() {
      beforeEach(function(){
        target.isCurrentValueStale = true;
      });

      it('should update the state', function() {
        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId2, fetchedUserState);
        $rootScope.$apply();

        expect(target.currentValue).toEqual(fetchedUserStateMapped);
        expect(target.isCurrentValueStale).toEqual(false);
      });

      it('should broadcast an event', function() {
        spyOn($rootScope, '$broadcast').and.callThrough();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId2, fetchedUserState);
        $rootScope.$apply();

        expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, fetchedUserStateMapped);
      });
    });
  });
});
