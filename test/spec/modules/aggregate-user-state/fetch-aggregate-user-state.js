describe('fetch aggregate user state', function(){
  'use strict';

  var userId = 'userId';
  var userId2 = 'userId2';
  var newUserState = { some: { complex: 'object', unchanged: true }};
  var successfulResponse = { data: newUserState };
  var error = 'error';

  var $q;

  var $rootScope;
  var fetchAggregateUserStateConstants;
  var userStateStub;
  var target;

  var now;

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

    jasmine.clock().install();
    jasmine.clock().mockDate();
    now = new Date();
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  });

  describe('when updating from the server with a user id', function() {

    it('should broadcast updated user state', function() {
      spyOn($rootScope, '$broadcast');
      userStateStub.getUserState.and.returnValue($q.when(successfulResponse));

      var result;
      target.updateFromServer(userId).then(function(r){ result = r; });
      $rootScope.$apply();

      expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
      expect(result).toEqual({ userId: userId, userState: newUserState});
      expect(target.internal.cache.lastUpdate).toBe(now.getTime());
      expect(target.internal.cache.lastUserId).toBe(userId);
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

        jasmine.clock().tick(1000);
      });

      it('should not call broadcast until the request is complete', function(){
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
      });

      describe('when the subsequent call has the same user id', function(){
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

          expect(target.internal.cache.lastUpdate).toBe(now.getTime());
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

      describe('when the subsequent call has a different user id', function(){
        var result;

        beforeEach(function(){
          userStateStub.getUserState.and.returnValue($q.when(successfulResponse));

          result = undefined;
          target.updateFromServer(userId2).then(function(r){ result = r; });
          $rootScope.$apply();
        });

        it('should immediately service the new request', function() {
          expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId2, newUserState);
          expect(result).toEqual({ userId: userId2, userState: newUserState});
          expect(target.internal.cache.lastUpdate).toBe(now.getTime() + 1000);
          expect(target.internal.cache.lastUserId).toBe(userId2);
        });

        it('should not broadcast an update when the old request completes', function(){
          deferred.resolve(successfulResponse);
          $rootScope.$apply();
          expect($rootScope.$broadcast).not.toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
          expect($rootScope.$broadcast.calls.count()).toBe(1);
          expect(target.internal.cache.lastUserId).toBe(userId2);
        });
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
      expect(target.internal.cache.lastUpdate).toBe(now.getTime());
      expect(target.internal.cache.lastUserId).toBe(undefined);
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

  describe('when calling updateInParallel', function(){
    var delegate;
    var delegateCalled;
    var deferredDelegate;
    var deferredUpdate;
    beforeEach(function(){
      deferredDelegate = $q.defer();
      deferredUpdate = $q.defer();

      spyOn(target, 'updateFromServer').and.returnValue(deferredUpdate.promise);

      delegateCalled = false;
      delegate = function(){ delegateCalled = true; return deferredDelegate.promise; };
    });

    describe('when both calls succeed', function(){
      var result;
      beforeEach(function(){
        result = undefined;
        target.updateInParallel(userId, delegate).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should not be complete', function(){
        expect(result).toBeUndefined();
      });

      describe('when the delegate call completes', function(){
        beforeEach(function(){
          deferredDelegate.resolve('done');
          $rootScope.$apply();
        });

        it('should not be complete', function(){
          expect(result).toBeUndefined();
        });

        describe('when the update call completes', function(){
          beforeEach(function(){
            deferredUpdate.resolve();
            $rootScope.$apply();
          });

          it('should complete with the result of the delegate', function(){
            expect(result).toBe('done');
          });
        });
      });

      describe('when the update call completes', function(){
        beforeEach(function(){
          deferredUpdate.resolve();
          $rootScope.$apply();
        });

        it('should not be complete', function(){
          expect(result).toBeUndefined();
        });

        describe('when the delegate call completes', function(){
          beforeEach(function(){
            deferredDelegate.resolve('done');
            $rootScope.$apply();
          });

          it('should complete with the result of the delegate', function(){
            expect(result).toBe('done');
          });
        });
      });

      describe('when the update call fails', function(){
        var error;
        beforeEach(function(){
          target.updateInParallel(userId, delegate).catch(function(e){ error = e; });
          deferredUpdate.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });

      describe('when the delegate call fails', function(){
        var error;
        beforeEach(function(){
          target.updateInParallel(userId, delegate).catch(function(e){ error = e; });
          deferredDelegate.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });

  describe('when calling waitForExistingUpdate', function(){
    var complete;
    var result;
    var error;
    beforeEach(function(){
      complete = false;
      result = undefined;
      error = undefined;
    });

    describe('when no existing update', function(){
      beforeEach(function(){
        target.internal.cache.currentRequest = undefined;
        target.waitForExistingUpdate().then(function(r){ complete = true; result = r;});
        $rootScope.$apply();
      });

      it('should complete immediately', function(){
        expect(complete).toBe(true);
      });

      it('should should return false', function(){
        expect(result).toBe(false);
      });
    });

    describe('when an update is in progress', function(){
      var deferred;
      beforeEach(function(){
        deferred = $q.defer();
        target.internal.cache.currentRequest = deferred.promise;
        target.waitForExistingUpdate().then(function(r){ complete = true; result = r;}, function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not complete immediately', function(){
        expect(complete).toBe(false);
      });

      describe('when the update succeeds', function(){
        beforeEach(function(){
          deferred.resolve('done');
          $rootScope.$apply();
        });

        it('should complete', function(){
          expect(complete).toBe(true);
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });
      });

      describe('when the update fails', function(){
        beforeEach(function(){
          deferred.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });

  describe('when calling updateIfStale', function(){
    var deferredWait;
    var deferredUpdate;
    var complete;
    var error;
    beforeEach(function(){
      complete = false;
      error = undefined;

      deferredWait = $q.defer();
      deferredUpdate = $q.defer();

      target.internal.cache.lastUpdate = now.getTime();
      target.internal.cache.lastUserId = userId;

      spyOn(target, 'waitForExistingUpdate').and.returnValue(deferredWait.promise);
      spyOn(target, 'updateFromServer').and.returnValue(deferredUpdate.promise);
    });

    var testCacheRefresh = function(){
      it('should wait for any existing update', function(){
        expect(target.waitForExistingUpdate).toHaveBeenCalled();
        expect(complete).toBe(false);
      });

      describe('when wait completes successfully', function(){
        beforeEach(function(){
          deferredWait.resolve();
          $rootScope.$apply();
        });

        it('should update the user state', function(){
          expect(target.updateFromServer).toHaveBeenCalled();
          expect(complete).toBe(false);
        });

        describe('when the update completes successfully', function(){
          beforeEach(function(){
            deferredUpdate.resolve();
            $rootScope.$apply();
          });

          it('should complete the call', function(){
            expect(complete).toBe(true);
          });
        });

        describe('when the update fails', function(){
          beforeEach(function(){
            deferredUpdate.reject('error');
            $rootScope.$apply();
          });

          it('should propagate the error', function(){
            expect(complete).toBe(false);
            expect(error).toBe('error');
          });
        });
      });

      describe('when the wait fails', function(){
        beforeEach(function(){
          deferredWait.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(complete).toBe(false);
          expect(error).toBe('error');
        });
      });
    };

    describe('when cache is not stale', function(){
      beforeEach(function(){
        target.updateIfStale(userId).then(function(){ complete = true; }, function(e) { error = e; });
        $rootScope.$apply();
      });

      it('should wait for any existing update', function(){
        expect(target.waitForExistingUpdate).toHaveBeenCalled();
        expect(complete).toBe(false);
      });

      describe('when wait is complete', function(){
        beforeEach(function(){
          deferredWait.resolve();
          $rootScope.$apply();
        });

        it('should complete the call', function(){
          expect(complete).toBe(true);
        });
      });

      describe('when the wait fails', function(){
        beforeEach(function(){
          deferredWait.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(complete).toBe(false);
          expect(error).toBe('error');
        });
      });
    });

    describe('when the user id has changed', function(){
      beforeEach(function(){
        target.updateIfStale(undefined).then(function(){ complete = true; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      testCacheRefresh();
    });

    describe('when the time limit has expired', function(){
      beforeEach(function(){
        jasmine.clock().tick(fetchAggregateUserStateConstants.refreshIfStaleMilliseconds);
        target.updateIfStale(userId).then(function(){ complete = true; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      testCacheRefresh();
    });

    describe('when this is the first request', function(){
      beforeEach(function(){
        target.internal.cache.lastUpdate = undefined;
        target.internal.cache.lastUserId = undefined;
        target.updateIfStale(userId).then(function(){ complete = true; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      testCacheRefresh();
    });
  });
});
