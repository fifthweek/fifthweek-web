describe('aggregate user state service', function() {
  'use strict';

  var newUserState = 'newUserState';
  var error = 'error';
  var userId = 'userId';
  var serviceName = 'aggregateUserStateService';

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
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateServiceConstants = $injector.get('aggregateUserStateServiceConstants');
      target = $injector.get(serviceName);
    });
  });

  it('should contain null user state by default', function() {
    expect(target.userState).toBeNull();
  });

  it('should initialize from local storage', function() {
    localStorageService.get.and.returnValue(null);
    target.initialize();
    expect(localStorageService.get).toHaveBeenCalledWith(serviceName);
    expect(target.userState).toBeNull();

    localStorageService.get.and.returnValue(newUserState);
    target.initialize();
    expect(localStorageService.get).toHaveBeenCalledWith(serviceName);
    expect(target.userState).toBe(newUserState);
  });

  describe('when refreshing user state', function() {

    it('should retain refreshed user state', function() {

      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));

      target.synchronizeWithServer(userId);
      $rootScope.$apply();

      expect(userStateStub.getUserState).toHaveBeenCalledWith(userId);
      expect(localStorageService.set).toHaveBeenCalledWith(serviceName, newUserState);
      expect(target.userState).toBe(newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getUserState.and.returnValue($q.reject(error));

      var result = null;
      target.synchronizeWithServer(userId).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(userStateStub.getUserState).toHaveBeenCalledWith(userId);
      expect(target.userState).toBe(null);
    });

    it('should raise event on success', function() {
      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.synchronizeWithServer(userId);
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateServiceConstants.synchronizedEvent, newUserState);
    });
  });

  describe('when refreshing user state (from no user ID)', function() {

    it('should retain refreshed user state', function() {

      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));

      target.synchronizeWithServer();
      $rootScope.$apply();

      expect(userStateStub.getVisitorState).toHaveBeenCalled();
      expect(localStorageService.set).toHaveBeenCalledWith(serviceName, newUserState);
      expect(target.userState).toBe(newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getVisitorState.and.returnValue($q.reject(error));

      var result = null;
      target.synchronizeWithServer().catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(userStateStub.getVisitorState).toHaveBeenCalled();
      expect(target.userState).toBe(null);
    });

    it('should raise event on success', function() {
      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.synchronizeWithServer();
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateServiceConstants.synchronizedEvent, newUserState);
    });
  });

});
