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
  var newUserState = { some: { complex: 'object', unchanged: true }, accessSignatures: { signature: 10 }};
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

  var getExpectedState = function(newUserId, state){
    var newState = _.cloneDeep(state);
    newState.userId = newUserId;
    delete newState.accessSignatures;
    return newState;
  };

  it('should contain undefined user state by default', function() {
    expect(target.currentValue).toBeUndefined();
  });

  describe('when initializing', function(){
    it('should initialize from local storage', function() {
      localStorageService.get.and.returnValue(undefined);
      target.initialize();
      expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
      expect(target.currentValue).toBeUndefined();

      localStorageService.get.and.returnValue(newUserState);
      target.initialize();
      expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
      expect(target.currentValue).toEqual(newUserState);
    });

    it('should attach to events', function(){
      spyOn($rootScope, '$on');

      target.initialize();

      expect($rootScope.$on.calls.count()).toBe(2);
      expect($rootScope.$on.calls.argsFor(0)[0]).toBe(fetchAggregateUserStateConstants.fetchedEvent);
      expect($rootScope.$on.calls.argsFor(1)[0]).toBe(authenticationServiceConstants.currentUserChangedEvent);
    });
  });

  describe('when initialized', function(){

    beforeEach(function(){
      target.initialize();
    });

    it('should not accept updates from a delta', function(){
      target.updateFromDelta(userId, newUserState);
      $rootScope.$apply();

      expect(target.currentValue).toBeUndefined();
      expect(localStorageService.set).not.toHaveBeenCalled();
    });

    describe('when an update is broadcast from the API', function(){

      var expectedState;
      var newUserStateCopy;
      beforeEach(function(){
        expectedState = getExpectedState(userId, newUserState);
        newUserStateCopy = _.cloneDeep(newUserState);
        spyOn($rootScope, '$broadcast').and.callThrough();
        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
        $rootScope.$apply();
      });

      it('should apply an update', function(){
        expect(target.currentValue).toEqual(expectedState);
      });

      it('should not contain access signatures', function(){
        expect(target.currentValue.hasOwnProperty('accessSignatures')).toBeFalsy();
      });

      it('should not mutate state', function(){
        expect(newUserState).toEqual(newUserStateCopy);
        expect(expectedState).not.toEqual(newUserStateCopy);
      });

      it('should save updates to local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, expectedState);
      });

      it('should raise an event when updated', function(){
        expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, expectedState);
      });
    });

    describe('when an update is broadcast from the API with an undefined user', function(){

      var expectedState;
      var newUserStateCopy;
      beforeEach(function(){
        expectedState = getExpectedState(undefined, newUserState);
        newUserStateCopy = _.cloneDeep(newUserState);
        spyOn($rootScope, '$broadcast').and.callThrough();
        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, newUserState);
        $rootScope.$apply();
      });

      it('should apply an update', function(){
        expect(target.currentValue).toEqual(expectedState);
      });

      it('should not mutate state', function(){
        expect(newUserState).toEqual(newUserStateCopy);
        expect(expectedState).not.toEqual(newUserStateCopy);
      });

      it('should save updates to local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, expectedState);
      });

      it('should raise an event when updated', function(){
        expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, expectedState);
      });
    });

    it('should still be undefined if the current user changes', function(){
      $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, { userId: userId });
      $rootScope.$apply();

      expect(target.currentValue).toBeUndefined();
      expect(localStorageService.set).not.toHaveBeenCalled();
    });

    describe('when initial state is set', function(){
      beforeEach(function(){
        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
        $rootScope.$apply();
      });

      it('should not change the state if the current user changed event is raised with the same user', function(){
        $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, { userId: userId });
        $rootScope.$apply();

        var expectedState = getExpectedState(userId, newUserState);
        expect(target.currentValue).toEqual(expectedState);
      });

      describe('when a current user change event is raised with a different user', function(){

        beforeEach(function(){
          spyOn($rootScope, '$broadcast').and.callThrough();
          $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, { userId: userId2 });
          $rootScope.$apply();
        });

        it('should clear the current value', function(){
          expect(target.currentValue).toBeUndefined();
        });

        it('should update the local storage', function(){
          expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, undefined);
        });

        it('should raise an event', function(){
          expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, undefined);
        });
      });

      describe('when a current user change event is raised with an undefined user', function(){

        beforeEach(function(){
          spyOn($rootScope, '$broadcast').and.callThrough();
          $rootScope.$broadcast(authenticationServiceConstants.currentUserChangedEvent, { userId: undefined });
          $rootScope.$apply();
        });

        it('should clear the current value', function(){
          expect(target.currentValue).toBeUndefined();
        });

        it('should update the local storage', function(){
          expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, undefined);
        });

        it('should raise an event', function(){
          expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, undefined);
        });
      });

      describe('when new state is fetched from the API with the same user ID', function(){

        var expected;
        beforeEach(function(){
          spyOn($rootScope, '$broadcast').and.callThrough();
          var delta = { some: { complex: 'foo'}, bar: 5};
          expected = getExpectedState(userId, { some: { complex: 'foo', unchanged: true }, bar:5});
          $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, delta);
          $rootScope.$apply();
        });

        it('should merge the new data', function(){
          expect(target.currentValue).toEqual(expected);
        });

        it('should update the local storage', function(){
          expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, expected);
        });

        it('should raise an event', function(){
          expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, expected);
        });
      });

      describe('when new state is fetched from the API with a different same user ID', function(){

        var expected;
        beforeEach(function(){
          spyOn($rootScope, '$broadcast').and.callThrough();
          var delta = { some: { complex: 'foo'}, bar: 5};
          expected = getExpectedState(userId2, delta);
          $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId2, delta);
          $rootScope.$apply();
        });

        it('should replace the old data', function(){
          expect(target.currentValue).toEqual(expected);
        });

        it('should update the local storage', function(){
          expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, expected);
        });

        it('should raise an event', function(){
          expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, expected);
        });
      });

      describe('when merging from a delta for the same user ID', function(){

        var existing;
        var existingCopy;
        var delta;
        var deltaCopy;
        var expected;

        beforeEach(function(){
          existing = target.currentValue;
          delta = { some: { complex: 'foo'}, bar: 5};
          expected = getExpectedState(userId, { some: { complex: 'foo', unchanged: true }, bar:5});
          existingCopy = _.cloneDeep(target.currentValue);
          deltaCopy = _.cloneDeep(delta);

          spyOn($rootScope, '$broadcast').and.callThrough();

          target.updateFromDelta(userId, delta);
          $rootScope.$apply();
        });

        it('should update the current state', function() {
          expect(target.currentValue).toEqual(expected);
        });

        it('should persist the new state to local storage', function() {
          expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, expected);
        });

        it('should not mutate existing state', function() {
          expect(existing).toEqual(existingCopy);
          expect(delta).toEqual(deltaCopy);
        });

        it('should raise an event', function() {
          expect($rootScope.$broadcast).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, expected);
        });
      });

      describe('when merging from a delta for a different user ID', function(){

        var delta;
        var expected;

        beforeEach(function(){
          delta = { some: { complex: 'foo'}, bar: 5};
          expected = getExpectedState(userId, newUserState);
          spyOn($rootScope, '$broadcast').and.callThrough();
          target.updateFromDelta(userId2, delta);
          $rootScope.$apply();
        });

        it('should not update the current state', function() {
          expect(target.currentValue).toEqual(expected);
        });

        it('should not raise an event', function() {
          expect($rootScope.$broadcast).not.toHaveBeenCalled();
        });
      });
    });
  });
});
