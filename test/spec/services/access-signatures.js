describe('access signatures state factory', function() {
  'use strict';

  var accessSignaturesImpl;
  var $injector;

  beforeEach(function(){
    accessSignaturesImpl = jasmine.createSpyObj('accessSignaturesImpl', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('accessSignaturesImpl', accessSignaturesImpl);
    });

    inject(function(_$injector_) {
      $injector = _$injector_;
    });
  });

  it('should initialize the access signatures service', function(){
    var target = $injector.get('accessSignatures');

    expect(target.initialize).toHaveBeenCalled();
  });

  it('should return the access signatures service', function(){
    var target = $injector.get('accessSignatures');

    expect(target).toBe(accessSignaturesImpl);
  });
});

describe('access signatures', function() {
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
  var accessSignaturesConstants;
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
      target = $injector.get('accessSignaturesImpl');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $state = $injector.get('$state');
      fifthweekConstants = $injector.get('fifthweekConstants');
      accessSignaturesConstants = $injector.get('accessSignaturesConstants');
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
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result;
        target.getAccessInformation().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return an error if fails to request new signatures on first call', function(){
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(500);

        var error;
        target.getAccessInformation().catch(function(response){
          error = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(error).toBeDefined();
        expect(error instanceof ApiError).toBeTruthy();
      });

      it('should request new signatures with a user ID if authenticated', function(){
        authenticationService.currentUser.userId = 'user1';
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/user1').respond(200, response);

        var result;
        target.getAccessInformation().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return public signatures', function(){
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result;
        target.getAccessInformation().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.signature).toBe(response.publicSignature.signature);
      });

      it('should return private signatures', function(){
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result;
        target.getAccessInformation('creator1').then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.signature).toBe(response.privateSignatures[0].information.signature);
      });

      it('should return an error for unknown creators', function(){
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var error;
        target.getAccessInformation('creatorX').catch(function(response){
          error = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(error).toBeDefined();
        expect(error instanceof FifthweekError).toBeTruthy();
      });
    });

    describe('when called for the second time', function(){
      it('should not request new signatures if called within expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response.publicSignature.signature);
      });

      it('should not request new signatures if called just before refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesConstants.refreshMinimumExpiry);

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response.publicSignature.signature);
      });

      it('should request new signatures if called just after refresh minimum expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesConstants.refreshMinimumExpiry + 1);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response2);

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response2.publicSignature.signature);
      });

      it('should request new signatures if called after expiry', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response2);

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response2.publicSignature.signature);
      });

      it('should request new signatures if signed in since last request', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user1';

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/user1').respond(200, response2);

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response2.publicSignature.signature);
      });

      it('should request new signatures if signed out since last request', function(){

        authenticationService.currentUser.userId = 'user1';
        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri+ '/user1').respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        authenticationService.currentUser.userId = undefined;

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response2);

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response2.publicSignature.signature);
      });

      it('should request new signatures if user changed since last request', function(){

        authenticationService.currentUser.userId = 'user1';
        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri+ '/user1').respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        authenticationService.currentUser.userId = 'user2';

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/user2').respond(200, response2);

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response2.publicSignature.signature);
      });

      describe('when refreshing fails', function(){
        it('should return the previous result if before the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

          var result1;
          target.getAccessInformation().then(function(response){
            result1 = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesConstants.failMinimumExpiry);

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(500);

          var result2;
          target.getAccessInformation().then(function(response){
            result2 = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          expect(result1).toBeDefined();
          expect(result1.signature).toBe(response.publicSignature.signature);

          expect(result2).toBeDefined();
          expect(result2.signature).toBe(response.publicSignature.signature);
        });

        it('should error if after the fail minimum expiry', function(){

          jasmine.clock().mockDate();

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

          var result1;
          target.getAccessInformation().then(function(response){
            result1 = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesConstants.failMinimumExpiry + 1);

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(500);

          var error;
          target.getAccessInformation().catch(function(response){
            error = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          expect(result1).toBeDefined();
          expect(result1.signature).toBe(response.publicSignature.signature);

          expect(error instanceof ApiError).toBeTruthy();
        });
      });
    });

    describe('when handling multiple simultaneous calls', function(){

      it('should apply the responses in order if they return in order', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/user1').respond(200, response2);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        authenticationService.currentUser.userId = 'user1';

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush(1);
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result2).toBeUndefined();
        expect(result1.signature).toBe(response.publicSignature.signature);

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response2.publicSignature.signature);
      });

      it('should share the previous promise if the user is the same', function(){

        jasmine.clock().mockDate();

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri).respond(200, response);

        var result1;
        target.getAccessInformation().then(function(response){
          result1 = response;
        });

        var result2;
        target.getAccessInformation().then(function(response){
          result2 = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result1).toBeDefined();
        expect(result1.signature).toBe(response.publicSignature.signature);
        expect(result2).toBeDefined();
        expect(result2.signature).toBe(response.publicSignature.signature);
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
        target.getAccessInformation().then(function(response){
          result = response;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.signature).toBe(response.publicSignature.signature);
      });

      it('should request new signatures if user changes', function(){

        authenticationService.currentUser.userId = 'user1';
        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/user1').respond(200, response2);

        var result;
        target.getAccessInformation().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.signature).toBe(response2.publicSignature.signature);
      });

      it('should request new signatures if timeout expires', function(){

        jasmine.clock().tick(defaultTimeToLiveSeconds * 1000);

        $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/' + userId).respond(200, response2);

        var result;
        target.getAccessInformation().then(function(response){
          result = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.signature).toBe(response2.publicSignature.signature);
      });

      describe('when refreshing fails', function(){
        it('should return the set result if before the fail minimum expiry', function(){

          jasmine.clock().tick(defaultTimeToLiveSeconds * 1000 - accessSignaturesConstants.failMinimumExpiry);

          $httpBackend.expectGET(fifthweekConstants.apiBaseUri + accessSignaturesConstants.refreshUri + '/' + userId).respond(500);

          var result;
          target.getAccessInformation().then(function(response){
            result = response;
          });

          $httpBackend.flush();
          $rootScope.$apply();

          expect(result).toBeDefined();
          expect(result.signature).toBe(response.publicSignature.signature);
        });
      });
    });
  });
});

