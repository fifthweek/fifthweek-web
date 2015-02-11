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

  var newUserState = 'newUserState';
  var error = 'error';
  var userId = 'userId';
  var localStorageKey = 'aggregateUserState';

  var $q;

  var $rootScope;
  var localStorageService;
  var aggregateUserStateConstants;
  var authenticationService;
  var userStateStub;
  var target;

  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      localStorageService = jasmine.createSpyObj('localStorageService', ['get', 'set']);
      userStateStub = jasmine.createSpyObj('userStateStub', ['getUserState', 'getVisitorState']);
      authenticationService = { currentUser:{} };

      $provide.value('localStorageService', localStorageService);
      $provide.value('userStateStub', userStateStub);
      $provide.value('authenticationService', 'aggregateUserStateImpl');
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      target = $injector.get(localStorageKey);
    });
  });

  it('should contain null user state by default', function() {
    expect(target.currentValue).toBeNull();
  });

  it('should initialize from local storage', function() {
    localStorageService.get.and.returnValue(null);
    target.initialize();
    expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
    expect(target.currentValue).toBeNull();

    localStorageService.get.and.returnValue(newUserState);
    target.initialize();
    expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
    expect(target.currentValue).toBe(newUserState);
  });

  describe('when synchronizing', function() {

    it('should retain new user state if existing state is empty', function() {
      target.updateFromDelta(newUserState);
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, newUserState);
      expect(target.currentValue).toBe(newUserState);
    });

    it('should merge new user state if existing state exists', function() {
      var existing = { some: { complex: 'object', unchanged: true }};
      var existingCopy = { some: { complex: 'object', unchanged: true }};
      var delta = { some: { complex: 'foo'}, bar: 5};
      var expected = { some: { complex: 'foo', unchanged: true }, bar:5};

      localStorageService.get.and.returnValue(existing);
      target.initialize();

      target.updateFromDelta(delta);
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, expected);
      expect(target.currentValue).toEqual(expected);
      expect(existing).toEqual(existingCopy); // Ensure state not mutated internally.
    });

    it('should raise and event', function() {
      spyOn($rootScope, '$broadcast');

      target.updateFromDelta(newUserState);
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, newUserState);
    });
  });

  describe('when synchronizing with server', function() {

    it('should retain refreshed user state', function() {

      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer(userId);
      $rootScope.$apply();

      expect(userStateStub.getUserState).toHaveBeenCalledWith(userId);
      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, newUserState);
      expect(target.currentValue).toBe(newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getUserState.and.returnValue($q.reject(error));

      var result = null;
      target.updateFromServer(userId).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(userStateStub.getUserState).toHaveBeenCalledWith(userId);
      expect(target.currentValue).toBe(null);
    });

    it('should raise an event on success', function() {
      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.updateFromServer(userId);
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, newUserState);
    });
  });

  describe('when synchronizing with server (from no user ID)', function() {

    it('should retain refreshed user state', function() {

      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer();
      $rootScope.$apply();

      expect(userStateStub.getVisitorState).toHaveBeenCalled();
      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, newUserState);
      expect(target.currentValue).toBe(newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getVisitorState.and.returnValue($q.reject(error));

      var result = null;
      target.updateFromServer().catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(userStateStub.getVisitorState).toHaveBeenCalled();
      expect(target.currentValue).toBe(null);
    });

    it('should raise an event on success', function() {
      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.updateFromServer();
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, newUserState);
    });
  });

});
