describe('aggregate user state service factory', function() {
  'use strict';

  var aggregateUserStateServiceImpl;
  var $injector;

  beforeEach(function(){
    aggregateUserStateServiceImpl = jasmine.createSpyObj('aggregateUserStateServiceImpl', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('aggregateUserStateServiceImpl', aggregateUserStateServiceImpl);
    });

    inject(function(_$injector_) {
      $injector = _$injector_;
    });
  });

  it('should initialize the authentication service', function(){
    var target = $injector.get('aggregateUserStateService');

    expect(target.initialize).toHaveBeenCalled();
  });

  it('should return the authentication service', function(){
    var target = $injector.get('aggregateUserStateService');

    expect(target).toBe(aggregateUserStateServiceImpl);
  });
});

describe('aggregate user state service', function() {
  'use strict';

  var newUserState = 'newUserState';
  var error = 'error';
  var userId = 'userId';
  var localStorageKey = 'aggregateUserStateService';

  var $q;

  var $rootScope;
  var localStorageService;
  var aggregateUserStateServiceConstants;
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
      $provide.value('authenticationService', 'aggregateUserStateServiceImpl');
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateServiceConstants = $injector.get('aggregateUserStateServiceConstants');
      target = $injector.get(localStorageKey);
    });
  });

  it('should contain null user state by default', function() {
    expect(target.userState).toBeNull();
  });

  it('should initialize from local storage', function() {
    localStorageService.get.and.returnValue(null);
    target.initialize();
    expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
    expect(target.userState).toBeNull();

    localStorageService.get.and.returnValue(newUserState);
    target.initialize();
    expect(localStorageService.get).toHaveBeenCalledWith(localStorageKey);
    expect(target.userState).toBe(newUserState);
  });

  describe('when synchronizing', function() {

    it('should retain new user state if existing state is empty', function() {
      target.updateFromDelta(newUserState);
      $rootScope.$apply();

      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, newUserState);
      expect(target.userState).toBe(newUserState);
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
      expect(target.userState).toEqual(expected);
      expect(existing).toEqual(existingCopy); // Ensure state not mutated internally.
    });

    it('should raise and event', function() {
      spyOn($rootScope, '$broadcast');

      target.updateFromDelta(newUserState);
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateServiceConstants.updatedEvent, newUserState);
    });
  });

  describe('when synchronizing with server', function() {

    it('should retain refreshed user state', function() {

      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer(userId);
      $rootScope.$apply();

      expect(userStateStub.getUserState).toHaveBeenCalledWith(userId);
      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, newUserState);
      expect(target.userState).toBe(newUserState);
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
      expect(target.userState).toBe(null);
    });

    it('should raise an event on success', function() {
      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.updateFromServer(userId);
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateServiceConstants.updatedEvent, newUserState);
    });
  });

  describe('when synchronizing with server (from no user ID)', function() {

    it('should retain refreshed user state', function() {

      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer();
      $rootScope.$apply();

      expect(userStateStub.getVisitorState).toHaveBeenCalled();
      expect(localStorageService.set).toHaveBeenCalledWith(localStorageKey, newUserState);
      expect(target.userState).toBe(newUserState);
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
      expect(target.userState).toBe(null);
    });

    it('should raise an event on success', function() {
      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.updateFromServer();
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateServiceConstants.updatedEvent, newUserState);
    });
  });

});
