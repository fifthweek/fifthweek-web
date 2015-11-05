describe('master repository factory', function(){
  'use strict';

  var userId = 'userId';
  var key = 'key';

  var $q;
  var $rootScope;
  var aggregateUserState;
  var authenticationService;
  var fetchAggregateUserState;
  var targetFactory;
  var target;

  var initialState;
  var initialStateClone;

  beforeEach(function() {
    module('webApp');

    authenticationService = { currentUser: { userId: userId } };
    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['setDelta']);
    aggregateUserState.currentValue = { key: {} };
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateFromServer', 'waitForExistingUpdate']);

    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('authenticationService', authenticationService);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      targetFactory = $injector.get('masterRepositoryFactory');
    });

    initialState = aggregateUserState.currentValue;
    initialStateClone = _.cloneDeep(initialState);

    target = targetFactory.forCurrentUser();
  });

  describe('when the current user has changed', function() {
    beforeEach(function() {
      authenticationService.currentUser.userId = 'changed';
    });

    it('should not update state', function() {
      target.update(key, function(value) { value.change = 'applied'; });
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should not set state', function() {
      target.set(key, {});
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should throw an error when reading state', function() {
      target.get(key).catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('Repository not valid for current user.');
      });

      $rootScope.$apply();
    });
  });

  describe('when there is no current user', function() {
    beforeEach(function() {
      delete authenticationService.currentUser;
    });

    it('should not update state', function() {
      target.update(key, function(value) { value.change = 'applied'; });
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should not set state', function() {
      target.set(key, {});
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should not throw an error when updating state', function() {
      target.update(key, function(value) { value.change = 'applied'; }).catch(function() {
        throw 'Assert never throws';
      });
      $rootScope.$apply();
    });

    it('should not throw an error when settting state', function() {
      target.set(key, {}).catch(function() {
        throw 'Assert never throws';
      });
      $rootScope.$apply();
    });

    it('should throw an error when reading state', function() {
      target.get(key).catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('Repository not valid for current user.');
      });

      $rootScope.$apply();
    });
  });

  describe('when there is no aggregate user state', function() {
    beforeEach(function() {
      delete aggregateUserState.currentValue;
    });

    it('should not update state', function() {
      target.update(key, function(value) { value.change = 'applied'; });
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should not set state', function() {
      target.set(key, {});
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should throw an error when updating state', function() {
      target.update(key, function(value) { value.change = 'applied'; }).catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('No aggregate state found.');
      });
      $rootScope.$apply();
    });

    it('should throw an error when setting state', function() {
      target.set(key, {}).catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('No aggregate state found.');
      });
      $rootScope.$apply();
    });
  });

  describe('when the provided key is invalid', function() {

    it('should not update state', function() {
      target.update('invalid', function(value) { value.change = 'applied'; });
      $rootScope.$apply();

      expect(initialState).toEqual(initialStateClone);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });

    it('should throw an error when updating state', function() {
      target.update('invalid', function(value) { value.change = 'applied'; }).catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('The key "invalid" does not match anything within the aggregate user state.');
      });
      $rootScope.$apply();
    });

    it('should throw an error when reading state', function() {
      target.get('invalid').catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('The key "invalid" does not match anything within the aggregate user state.');
      });
      $rootScope.$apply();
    });
  });

  describe('when updating a value', function(){

    describe('when apply method fails synchronously', function(){
      var actualError;
      var expectedError = 'error';

      beforeEach(function(){
        target
          .update(key, function(value) {
            value.change = 'applied';
            throw expectedError;
          })
          .catch(function(thrownError) {
            actualError = thrownError;
          });
        $rootScope.$apply();
      });

      it('should not update state', function(){
        expect(initialState).toEqual(initialStateClone);
        expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
      });

      it('should return a rejected promise', function(){
        expect(expectedError).toBe(actualError);
      });
    });

    describe('when apply method fails asynchronously', function(){
      var actualError;
      var expectedError = 'error';

      beforeEach(function(){
        target
          .update(key, function(value) {
            value.change = 'applied';
            return $q.reject(expectedError);
          })
          .catch(function(thrownError) {
            actualError = thrownError;
          });
        $rootScope.$apply();
      });

      it('should not update state', function(){
        expect(initialState).toEqual(initialStateClone);
        expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
      });

      it('should return a rejected promise', function(){
        expect(expectedError).toBe(actualError);
      });
    });

    describe('when apply method succeeds', function(){
      beforeEach(function(){
        aggregateUserState.currentValue = { key: { deep: {} } };
        target.update('key.deep', function(value) {
          value.change = 'applied';
        });
        $rootScope.$apply();
      });

      it('should not modify the aggregate user state directly', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should call mergeDelta with the new structure', function(){
        expect(aggregateUserState.setDelta).toHaveBeenCalledWith(
          userId,
          'key.deep',
          {
            change: 'applied'
          });
      });
    });
  });

  describe('when setting a value', function(){

    var newStructure = { change: 'applied', and: { anotherChange: 'also-applied' }};

    beforeEach(function(){
      aggregateUserState.currentValue = { key: { deep: {} } };
      target.set('key.deep', newStructure);
      $rootScope.$apply();
    });

    it('should call mergeDelta with a copy of the new structure', function(){
      expect(aggregateUserState.setDelta).toHaveBeenCalledWith(
        userId,
        'key.deep',
        newStructure);

      var passedStructure = aggregateUserState.setDelta.calls.first().args[2];

      expect(passedStructure).toEqual(newStructure);
      expect(passedStructure).not.toBe(newStructure);

      newStructure.and.anotherChange = 'something-else';
      expect(passedStructure.and.anotherChange).toBe('also-applied');
    });
  });

  describe('when getting a value', function(){

    var deferredUserState;
    var result;
    var error;
    beforeEach(function(){
      deferredUserState = $q.defer();
      result = undefined;
      error = undefined;

      spyOn(target.internal, 'ensureUserState').and.returnValue(deferredUserState.promise);
    });

    describe('when allowing unmatched', function(){
      beforeEach(function(){
        target.get(key, true).then(function(r){ result = r; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      describe('when ensureUserState succeeds', function(){

        describe('when key matches', function(){
          beforeEach(function(){
            deferredUserState.resolve();
            $rootScope.$apply();
          });

          it('should return a value', function(){
            expect(result).toBeDefined();
          });

          it('should return a clone', function() {
            result.value = 'changed';
            expect(initialState).toEqual(initialStateClone);
          });
        });

        describe('when key does not match', function(){
          beforeEach(function(){
            aggregateUserState.currentValue = {};
            deferredUserState.resolve();
            $rootScope.$apply();
          });

          it('should return undefined', function(){
            expect(result).toBeUndefined();
          });
        });
      });

      describe('when ensureUserState fails', function(){
        beforeEach(function(){
          deferredUserState.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when not allowing unmatched', function(){
      beforeEach(function(){
        target.get(key).then(function(r){ result = r; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      describe('when ensureUserState succeeds', function(){

        describe('when key matches', function(){
          beforeEach(function(){
            deferredUserState.resolve();
            $rootScope.$apply();
          });

          it('should return a value', function(){
            expect(result).toBeDefined();
          });

          it('should return a clone', function() {
            result.value = 'changed';
            expect(initialState).toEqual(initialStateClone);
          });
        });

        describe('when key does not match', function(){
          beforeEach(function(){
            aggregateUserState.currentValue = {};
            deferredUserState.resolve();
            $rootScope.$apply();
          });

          it('should error', function(){
            expect(error).toBeDefined();
          });
        });
      });

      describe('when ensureUserState fails', function(){
        beforeEach(function(){
          deferredUserState.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });

  describe('when calling ensureUserState', function(){

    var success;
    var error;
    var deferredWaitForExistingUpdate;
    beforeEach(function(){
      success = undefined;
      error = undefined;

      deferredWaitForExistingUpdate = $q.defer();
      fetchAggregateUserState.waitForExistingUpdate.and.returnValue(deferredWaitForExistingUpdate.promise);

      target.internal.ensureUserState().then(function(){ success = true; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call waitForExistingUpdate', function(){
      expect(fetchAggregateUserState.waitForExistingUpdate).toHaveBeenCalledWith();
    });

    describe('when waitForExistingUpdate succeeds', function(){

      describe('when aggregate user state is set and not stale', function(){
        beforeEach(function(){
          aggregateUserState.currentValue = 'value';
          aggregateUserState.isCurrentValueStale = false;

          deferredWaitForExistingUpdate.resolve();
          $rootScope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      var newCurrentValue;
      var newIsCurrentValueStale;
      var testUpdate = function() {
        describe('when aggregate user state is not set', function(){
          var deferredUpdateFromServer;
          beforeEach(function(){
            deferredUpdateFromServer = $q.defer();
            fetchAggregateUserState.updateFromServer.and.returnValue(deferredUpdateFromServer.promise);
            aggregateUserState.currentValue = newCurrentValue;
            aggregateUserState.isCurrentValueStale = newIsCurrentValueStale;

            deferredWaitForExistingUpdate.resolve();
            $rootScope.$apply();
          });

          it('should not have completed', function(){
            expect(success).toBe(false);
          });

          it('should call updateFromServer', function(){
            expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith();
          });

          describe('when the update has completed successfully', function(){
            beforeEach(function(){
              deferredUpdateFromServer.resolve();
              $rootScope.$apply();
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when the update has failed', function(){
            beforeEach(function(){
              deferredUpdateFromServer.reject('error');
              $rootScope.$apply();
            });

            it('should propagate the error', function(){
              expect(error).toBe('error');
            });
          });
        });
      };

      describe('when current value is not set', function(){
        beforeEach(function(){
          newCurrentValue = undefined;
          newIsCurrentValueStale = false;
        });

        testUpdate();
      });

      describe('when current value is not set', function(){
        beforeEach(function(){
          newCurrentValue = 'value';
          newIsCurrentValueStale = true;
        });

        testUpdate();
      });
    });

    describe('when waitForExistingUpdate fails', function(){
      beforeEach(function(){
        deferredWaitForExistingUpdate.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });
});
