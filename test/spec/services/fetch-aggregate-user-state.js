describe('fetch aggregate user state', function(){
  'use strict';

  var userId = 'userId';
  var newUserState = { some: { complex: 'object', unchanged: true }};
  var successfulResponse = { data: newUserState };
  var error = 'error';

  var $q;

  var $rootScope;
  var fetchAggregateUserStateConstants;
  var userStateStub;
  var target;


  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      userStateStub = jasmine.createSpyObj('userStateStub', ['getUserState', 'getVisitorState']);

      $provide.value('userStateStub', userStateStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      fetchAggregateUserStateConstants = $injector.get('fetchAggregateUserStateConstants');
      target = $injector.get('fetchAggregateUserState');
    });
  });

  describe('when updating from the server with a user id', function() {

    it('should broadcast updated user state', function() {

      spyOn($rootScope, '$broadcast');
      userStateStub.getUserState.and.returnValue($q.when(successfulResponse));

      target.updateFromServer(userId);
      $rootScope.$apply();

      expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getUserState.and.returnValue($q.reject(error));

      var result = null;
      target.updateFromServer(userId).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
    });

    describe('when an existing request is in progress', function(){

      var deferred;
      var isInitialCallComplete;
      beforeEach(function(){
        spyOn($rootScope, '$broadcast');

        deferred = $q.defer();
        userStateStub.getUserState.and.returnValue(deferred.promise);

        isInitialCallComplete = false;
        target.updateFromServer(userId).then(function(){
          isInitialCallComplete = true;
        });

        $rootScope.$apply();
      });

      it('should not call broadcast until the request is complete', function(){
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
      });

      it('should return the exiting promise for subsequent requests', function(){
        userStateStub.getUserState.calls.reset();

        var result = target.updateFromServer(userId);

        expect(userStateStub.getUserState).not.toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('should complete both calls when the server responds', function(){
        var isCallComplete = false;
        target.updateFromServer(userId).then(function(){
          isCallComplete = true;
        });

        expect(isInitialCallComplete).toBe(false);
        expect(isCallComplete).toBe(false);

        deferred.resolve(successfulResponse);
        $rootScope.$apply();

        expect(isInitialCallComplete).toBe(true);
        expect(isCallComplete).toBe(true);
      });

      it('should only call broadcast once', function(){
        target.updateFromServer(userId);

        deferred.resolve(successfulResponse);
        $rootScope.$apply();

        expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
        expect($rootScope.$broadcast.calls.count()).toBe(1);
      });

      it('should call the server for subsequent requests after the initial request completes', function(){
        deferred.resolve(successfulResponse);
        $rootScope.$apply();

        userStateStub.getUserState.calls.reset();
        $rootScope.$broadcast.calls.reset();

        userStateStub.getUserState.and.returnValue($q.when(successfulResponse));

        target.updateFromServer(userId);
        $rootScope.$apply();

        expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
        expect(userStateStub.getUserState).toHaveBeenCalledWith(userId);
      });
    });
  });

  describe('when updating from the server with no user id', function() {

    it('should broadcast updated user state', function() {

      spyOn($rootScope, '$broadcast');
      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer();
      $rootScope.$apply();

      expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, undefined, newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getVisitorState.and.returnValue($q.reject(error));

      var result = null;
      target.updateFromServer().catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
    });
  });
});
