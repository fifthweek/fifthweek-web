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

  var response = {
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
  };

  var response2 = {
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
  };

  var target;
  var $httpBackend;
  var $rootScope;
  var $state;
  var fifthweekConstants;
  var utilities;
  var authenticationService;
  var accessSignaturesCacheConstants;
  var fetchAggregateUserStateConstants;

  beforeEach(function() {
    authenticationService = {
      currentUser: { userId: undefined }
    };
    utilities = {};
    utilities.getHttpError = function(){ return new ApiError(); };

    module('webApp', 'stateMock');

    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('utilities', utilities);
    });

    inject(function($injector) {
      target = $injector.get('accessSignaturesCacheImpl');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      fifthweekConstants = $injector.get('fifthweekConstants');
      accessSignaturesCacheConstants = $injector.get('accessSignaturesCacheConstants');
      fetchAggregateUserStateConstants = $injector.get('fetchAggregateUserStateConstants');
    });

    jasmine.clock().install();
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

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
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return an error if fails to request new signatures on first call', function(){
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(500);

        var error;
        target.getSignatures().catch(function(response){
          error = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(error).toBeDefined();
        expect(error instanceof ApiError).toBeTruthy();
      });

      it('should request new signatures with a user ID if authenticated', function(){
        authenticationService.currentUser.userId = 'user1';
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/user1').respond(200, response);

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return signatures', function(){
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response);
      });
    });

    describe('when called for the second time', function(){
      it('should not request new signatures if called within expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response);
      });

      it('should not request new signatures if called just before refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.refreshMinimumExpiry);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response);
      });

      it('should request new signatures if called just after refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.refreshMinimumExpiry + 1);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response2);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2);
      });

      it('should request new signatures if called after expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response2);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2);
      });

      it('should request new signatures if signed in since last request', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user1';

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/user1').respond(200, response2);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2);
      });

      it('should request new signatures if signed out since last request', function(){

        authenticationService.currentUser.userId = 'user1';
        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri+ '/user1').respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        authenticationService.currentUser.userId = undefined;

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response2);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2);
      });

      it('should request new signatures if user changed since last request', function(){

        authenticationService.currentUser.userId = 'user1';
        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri+ '/user1').respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user2';

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/user2').respond(200, response2);

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2);
      });

      describe('when refreshing fails', function(){
        it('should return the previous result if before the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

          var result1;
          target.getSignatures().then(function(response){
            result1 = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry);

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(500);

          var result2;
          target.getSignatures().then(function(response){
            result2 = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          expect(result1).toBeDefined();
          expect(result1).toEqual(response);

          expect(result2).toBeDefined();
          expect(result2).toEqual(response);
        });

        it('should error if after the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

          var result1;
          target.getSignatures().then(function(response){
            result1 = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry + 1);

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(500);

          var error;
          target.getSignatures().catch(function(response){
            error = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          expect(result1).toBeDefined();
          expect(result1).toEqual(response);

          expect(error instanceof ApiError).toBeTruthy();
        });
      });
    });

    describe('when handling multiple simultaneous calls', function(){

      it('should apply the responses in order if they return in order', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/user1').respond(200, response2);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        authenticationService.currentUser.userId = 'user1';

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush(1);
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result2).toBeUndefined();
        expect(result1).toEqual(response);

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result2).toBeDefined();
        expect(result2).toEqual(response2);
      });

      it('should share the previous promise if the user is the same', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri).respond(200, response);

        var result1;
        target.getSignatures().then(function(response){
          result1 = response;
        });

        var result2;
        target.getSignatures().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1).toEqual(response);
        expect(result2).toBeDefined();
        expect(result2).toEqual(response);
      });
    });

    describe('when new access signatures are fetched with user state', function(){

      var userId;

      beforeEach(function(){
        userId = 'someUser';
        authenticationService.currentUser.userId = userId;

        jasmine.clock().mockDate();

        $rootScope.$broadcast(fetchAggregateUserStateConstants.fetchedEvent, userId, { accessSignatures: response });
        $rootScope.$apply();
      });

      it('should return saved data without requesting from server if within timeout', function(){

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response);
      });

      it('should request new signatures if user changes', function(){

        authenticationService.currentUser.userId = 'user1';
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/user1').respond(200, response2);

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response2);
      });

      it('should request new signatures if timeout expires', function(){

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/' + userId).respond(200, response2);

        var result;
        target.getSignatures().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result).toEqual(response2);
      });

      describe('when refreshing fails', function(){
        it('should return the set result if before the fail minimum expiry', function(){

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesCacheConstants.failMinimumExpiry);

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesCacheConstants.refreshUri + '/' + userId).respond(500);

          var result;
          target.getSignatures().then(function(response){
            result = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          expect(result).toBeDefined();
          expect(result).toEqual(response);
        });
      });
    });
  });
});

