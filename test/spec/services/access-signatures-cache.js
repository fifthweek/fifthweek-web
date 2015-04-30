describe('access signatures cache factory', function() {
  'use strict';

  var accessSignaturesCacheImpl;
  var $injector;

  beforeEach(function(){
    accessSignaturesCacheImpl = jasmine.createSpyObj('accessSignaturesCacheImpl', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('accessSignaturesCacheImpl', accessSignaturesCacheImpl);
    });

    inject(function(_$injector_) {
      $injector = _$injector_;
    });
  });

  it('should initialize the access signatures service', function(){
    var target = $injector.get('accessSignaturesCache');

    expect(target.initialize).toHaveBeenCalled();
  });

  it('should return the access signatures service', function(){
    var target = $injector.get('accessSignaturesCache');

    expect(target).toBe(accessSignaturesCacheImpl);
  });
});

describe('access signatures cache', function() {
  'use strict';

  var defaultTimeToLiveSeconds = 3600;

  var response =
  {
    userState: {
      accessSignatures: {
        timeToLiveSeconds: defaultTimeToLiveSeconds,
        publicSignature: {
          containerName: 'files',
          uri: 'https://files.fifthweek.com/public',
          signature: '?abcd',
          expiry: 1234
        },
        privateSignatures: [
          {
            creatorId: 'creator1',
            information: {
              containerName: 'creator1',
              uri: 'https://files.fifthweek.com/creator1',
              signature: '?abcd',
              expiry: 1234
            }
          },
          {
            creatorId: 'creator2',
            information: {
              containerName: 'creator2',
              uri: 'https://files.fifthweek.com/creator2',
              signature: '?efgh',
              expiry: 1234
            }
          }
        ]
      }
    }
  };

  var response2 =
  {
    userState: {
      accessSignatures: {
        timeToLiveSeconds: defaultTimeToLiveSeconds,
        publicSignature: {
          containerName: 'files',
          uri: 'https://files.fifthweek.com/public',
          signature: '?abcd2',
          expiry: 1234
        },
        privateSignatures: [
          {
            creatorId: 'creator1',
            information: {
              containerName: 'creator1',
              uri: 'https://files.fifthweek.com/creator1',
              signature: '?abcd2',
              expiry: 1234
            }
          },
          {
            creatorId: 'creator2',
            information: {
              containerName: 'creator2',
              uri: 'https://files.fifthweek.com/creator2',
              signature: '?efgh2',
              expiry: 1234
            }
          }
        ]
      }
    }
  };

  var target;
  var $rootScope;
  var $state;
  var $q;
  var fetchAggregateUserState;
  var authenticationService;
  var accessSignaturesCacheConstants;
  var fetchAggregateUserStateConstants;

  beforeEach(function() {
    authenticationService = {
      currentUser: { userId: undefined }
    };

    module('webApp', 'stateMock');

    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateFromServer']);

    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
    });

    inject(function($injector) {
      target = $injector.get('accessSignaturesCacheImpl');
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      $q = $injector.get('$q');
      accessSignaturesCacheConstants = $injector.get('accessSignaturesCacheConstants');
      fetchAggregateUserStateConstants = $injector.get('fetchAggregateUserStateConstants');
    });

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  describe('when initializing', function(){
    it('should attach to events', function(){
      spyOn($rootScope, '$on');

      target.initialize();

      expect($rootScope.$on.calls.count()).toBe(1);
      expect($rootScope.$on.calls.argsFor(0)[0]).toBe(fetchAggregateUserStateConstants.fetchedEvent);
    });
  });

  describe('when initialized', function(){

    beforeEach(function(){
      target.initialize();
    });

    describe('when called for the first time', function(){
      it('should request new signatures', function(){
        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response));

        target.getSignatures();

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith(undefined);
      });

      it('should return an error if fails to request new signatures on first call', function(){
        fetchAggregateUserState.updateFromServer.and.returnValue($q.reject(new ApiError('error')));

        var error;
        target.getSignatures().catch(function(response){
          error = response;
        });

        $rootScope.$apply();

        expect(error).toBeDefined();
        expect(error instanceof ApiError).toBeTruthy();
      });

      it('should request new signatures with a user ID if authenticated', function(){
        authenticationService.currentUser.userId = 'user1';
        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response));

        target.getSignatures();

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith('user1');
      });

      it('should return signatures', function(){
        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response.userState.accessSignatures);
      });
    });

    describe('when called for the second time', function(){
      it('should not request new signatures if called within expiry', function(){

        jasmine.clock().mockDate();

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response));

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
        $rootScope.$apply();

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(0);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.userState.accessSignatures);
      });

      it('should not request new signatures if called just before refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response));

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.refreshMinimumExpiry);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(0);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.userState.accessSignatures);
      });

      it('should request new signatures if called just after refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.refreshMinimumExpiry + 1);

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response2.userState.accessSignatures);
      });

      it('should request new signatures if called after expiry', function(){

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response2.userState.accessSignatures);
      });

      it('should request new signatures if signed in since last request', function(){

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user1';

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response2.userState.accessSignatures);
      });

      it('should request new signatures if signed out since last request', function(){

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, 'user1', response.userState);
        $rootScope.$apply();

        authenticationService.currentUser.userId = undefined;

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response2.userState.accessSignatures);
      });

      it('should request new signatures if user changed since last request', function(){

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, 'user1', response.userState);
        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user2';

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);
        expect(fetchAggregateUserState.updateFromServer.calls.first().args[0]).toBe('user2');

        expect(result1).toBeDefined();
        expect(result1).toEqual(response2.userState.accessSignatures);
      });

      describe('when refreshing fails', function(){
        it('should return the previous result if before the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry);

          fetchAggregateUserState.updateFromServer.and.returnValue($q.reject(new ApiError('bad')));

          var result1;
          target.getSignatures().then(function(response){
            result1 = response;
          });

          $rootScope.$apply();

          expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);

          expect(result1).toBeDefined();
          expect(result1).toEqual(response.userState.accessSignatures);
        });

        it('should error if after the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, undefined, response.userState);
          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry + 1);

          fetchAggregateUserState.updateFromServer.and.returnValue($q.reject(new ApiError('bad')));

          var error;
          target.getSignatures().catch(function(response){
            error = response;
          });

          $rootScope.$apply();

          expect(fetchAggregateUserState.updateFromServer.calls.count()).toBe(1);

          expect(error instanceof ApiError).toBeTruthy();
        });
      });
    });

    describe('when new access signatures are fetched with user state', function(){

      var userId;

      beforeEach(function(){
        userId = 'someUser';
        authenticationService.currentUser.userId = userId;

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, response.userState);
        $rootScope.$apply();
      });

      it('should return saved data without requesting from server if within timeout', function(){

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response.userState.accessSignatures);
      });

      it('should request new signatures if user changes', function(){

        authenticationService.currentUser.userId = 'user1';
        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response2.userState.accessSignatures);
      });

      it('should request new signatures if timeout expires', function(){

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        fetchAggregateUserState.updateFromServer.and.returnValue($q.when(response2));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response2.userState.accessSignatures);
      });

      describe('when refreshing fails', function(){
        it('should return the set result if before the fail minimum expiry', function(){

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry);

          fetchAggregateUserState.updateFromServer.and.returnValue($q.reject(new ApiError('error')));

          var result;
          target.getSignatures().then(function(response){
            result = response;
          });

          $rootScope.$apply();

          expect(result).toBeDefined();
          expect(result).toEqual(response.userState.accessSignatures);
        });
      });
    });
  });
});

