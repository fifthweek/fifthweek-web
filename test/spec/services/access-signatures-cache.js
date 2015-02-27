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
    data: {
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
  };

  var response2 =
  {
    data: {
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
  };

  var target;
  var $rootScope;
  var $state;
  var $q;
  var userAccessSignaturesStub;
  var authenticationService;
  var accessSignaturesCacheConstants;
  var fetchAggregateUserStateConstants;

  beforeEach(function() {
    authenticationService = {
      currentUser: { userId: undefined }
    };

    module('webApp', 'stateMock');

    userAccessSignaturesStub = jasmine.createSpyObj('userAccessSignaturesStub', ['getForUser', 'getForVisitor']);

    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('userAccessSignaturesStub', userAccessSignaturesStub);
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
        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor).toHaveBeenCalled();
      });

      it('should return an error if fails to request new signatures on first call', function(){
        userAccessSignaturesStub.getForVisitor.and.returnValue($q.reject(new ApiError('error')));

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
        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForUser).toHaveBeenCalledWith('user1');
      });

      it('should return signatures', function(){
        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response.data);
      });
    });

    describe('when called for the second time', function(){
      it('should not request new signatures if called within expiry', function(){

        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response.data);
      });

      it('should not request new signatures if called just before refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.refreshMinimumExpiry);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response.data);
      });

      it('should request new signatures if called just after refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.refreshMinimumExpiry + 1);

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response2));

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(2);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);
      });

      it('should request new signatures if called after expiry', function(){

        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response2));

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(2);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);
      });

      it('should request new signatures if signed in since last request', function(){

        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user1';

        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response2));

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);
        expect(userAccessSignaturesStub.getForUser.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);
      });

      it('should request new signatures if signed out since last request', function(){

        authenticationService.currentUser.userId = 'user1';
        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        authenticationService.currentUser.userId = undefined;

        userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response2));

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForUser.calls.count()).toBe(1);
        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);
      });

      it('should request new signatures if user changed since last request', function(){

        authenticationService.currentUser.userId = 'user1';
        jasmine.clock().mockDate();

        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response));

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user2';

        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response2));

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForUser.calls.count()).toBe(2);
        expect(userAccessSignaturesStub.getForUser.calls.first().args[0]).toBe('user1');
        expect(userAccessSignaturesStub.getForUser.calls.mostRecent().args[0]).toBe('user2');

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);
      });

      describe('when refreshing fails', function(){
        it('should return the previous result if before the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

          var result1;
          target.getSignatures().then(function(response){
            result1 = response;
          });

          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry);

          userAccessSignaturesStub.getForVisitor.and.returnValue($q.reject(new ApiError('bad')));

          var result2;
          target.getSignatures().then(function(response){
            result2 = response;
          });

          $rootScope.$apply();

          expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(2);

          expect(result1).toBeDefined();
          expect(result1).toEqual(response.data);

          expect(result2).toBeDefined();
          expect(result2).toEqual(response.data);
        });

        it('should error if after the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          userAccessSignaturesStub.getForVisitor.and.returnValue($q.when(response));

          var result1;
          target.getSignatures().then(function(response){
            result1 = response;
          });

          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry + 1);

          userAccessSignaturesStub.getForVisitor.and.returnValue($q.reject(new ApiError('bad')));

          var error;
          target.getSignatures().catch(function(response){
            error = response;
          });

          $rootScope.$apply();

          expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(2);

          expect(result1).toBeDefined();
          expect(result1).toEqual(response.data);

          expect(error instanceof ApiError).toBeTruthy();
        });
      });
    });

    describe('when handling multiple simultaneous calls', function(){

      it('should apply the responses in order if they return in order', function(){

        jasmine.clock().mockDate();

        var deferred1 = $q.defer();
        var deferred2 = $q.defer();
        userAccessSignaturesStub.getForVisitor.and.returnValue(deferred1.promise);
        userAccessSignaturesStub.getForUser.and.returnValue(deferred2.promise);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        authenticationService.currentUser.userId = 'user1';

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        deferred1.resolve(response);
        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);
        expect(userAccessSignaturesStub.getForUser.calls.count()).toBe(1);

        expect(result1).toBeDefined();
        expect(result2).toBeUndefined();
        expect(result1).toEqual(response.data);

        deferred2.resolve(response2);
        $rootScope.$apply();

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);
      });

      it('should only add the most recent request\'s response to the cache if they return out of order', function(){

        jasmine.clock().mockDate();

        var deferred1 = $q.defer();
        var deferred2 = $q.defer();
        userAccessSignaturesStub.getForVisitor.and.returnValue(deferred1.promise);
        userAccessSignaturesStub.getForUser.and.returnValue(deferred2.promise);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        authenticationService.currentUser.userId = 'user1';

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        deferred2.resolve(response2);
        $rootScope.$apply();

        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);
        expect(userAccessSignaturesStub.getForUser.calls.count()).toBe(1);

        expect(result1).toBeUndefined();
        expect(result2).toBeDefined();
        expect(result2).toEqual(response2.data);

        deferred1.resolve(response);
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);

        // If result1 was incorrectly cached then the user ID wouldn't match the cache and a new http request would occur.
        var result3;
        target.getSignatures().then(function(response){
          result3 = response;
        });

        $rootScope.$apply();
        expect(userAccessSignaturesStub.getForVisitor.calls.count()).toBe(1);
        expect(userAccessSignaturesStub.getForUser.calls.count()).toBe(1);
        expect(result3).toEqual(response2.data);
      });

      it('should share the previous promise if the user is the same', function(){

        jasmine.clock().mockDate();

        var deferred1 = $q.defer();
        userAccessSignaturesStub.getForVisitor.and.returnValue(deferred1.promise);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        deferred1.resolve(response);
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response.data);
        expect(result2).toBeDefined();
        expect(result2).toEqual(response.data);
      });
    });

    describe('when new access signatures are fetched with user state', function(){

      var userId;

      beforeEach(function(){
        userId = 'someUser';
        authenticationService.currentUser.userId = userId;

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, { accessSignatures: response.data });
        $rootScope.$apply();
      });

      it('should return saved data without requesting from server if within timeout', function(){

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response.data);
      });

      it('should request new signatures if user changes', function(){

        authenticationService.currentUser.userId = 'user1';
        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response2));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response2.data);
      });

      it('should request new signatures if timeout expires', function(){

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        userAccessSignaturesStub.getForUser.and.returnValue($q.when(response2));

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response2.data);
      });

      describe('when refreshing fails', function(){
        it('should return the set result if before the fail minimum expiry', function(){

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry);

          userAccessSignaturesStub.getForUser.and.returnValue($q.reject(new ApiError('error')));

          var result;
          target.getSignatures().then(function(response){
            result = response;
          });

          $rootScope.$apply();

          expect(result).toBeDefined();
          expect(result).toEqual(response.data);
        });
      });
    });
  });
});

