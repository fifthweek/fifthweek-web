describe('master repository factory', function(){
  'use strict';

  var userId = 'userId';
  var key = 'key';

  var $q;
  var $rootScope;
  var aggregateUserState;
  var authenticationService;
  var targetFactory;
  var target;

  var initialState;
  var initialStateClone;

  beforeEach(function() {
    module('webApp');

    authenticationService = { currentUser: { userId: userId } };
    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['setDelta']);
    aggregateUserState.currentValue = { key: {} };

    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('authenticationService', authenticationService);
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

    it('should throw an error when reading state', function() {
      target.get(key).catch(function(error){
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

    it('should return a clone', function() {
      target.get(key).value = 'changed';
      expect(initialState).toEqual(initialStateClone);
    });
  });
});
