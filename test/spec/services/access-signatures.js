fdescribe('access signatures', function() {
  'use strict';

  var response = {
    timeToLiveSeconds: 1000,
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
          containerName: 'container1',
          uri: 'https://files.fifthweek.com/creator1',
          signature: '?abcd',
          expiry: 1234
        }
      },
      {
        creatorId: 'creator2',
        information: {
          containerName: 'container2',
          uri: 'https://files.fifthweek.com/creator2',
          signature: '?efgh',
          expiry: 1234
        }
      }
    ]
  };

  var $rootScope;
  var $q;
  var target;
  var accessSignaturesCache;
  var accessSignaturesConstants;

  beforeEach(function() {
    accessSignaturesCache = jasmine.createSpyObj('accessSignaturesCache', ['getSignatures']);

    module('webApp', 'stateMock');

    module(function($provide) {
      $provide.value('accessSignaturesCache', accessSignaturesCache);
    });

    inject(function($injector) {
      target = $injector.get('accessSignatures');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      accessSignaturesConstants = $injector.get('accessSignaturesConstants');
    });
  });

  describe('when signatures are available', function(){
    beforeEach(function(){
      accessSignaturesCache.getSignatures.and.returnValue($q.when(response));
    });

    it('should return public access information', function(){
      target.getPublicAccessInformation().then(function(result){
        expect(result).toEqual(response.publicSignature);
      });
      $rootScope.$apply();
    });

    it('should return the correct private access information when creatorId is specified', function(){
      target.getCreatorAccessInformation('creator1').then(function(result){
        expect(result).toEqual(response.privateSignatures[0].information);
      });
      $rootScope.$apply();

      target.getCreatorAccessInformation('creator2').then(function(result){
        expect(result).toEqual(response.privateSignatures[1].information);
      });
      $rootScope.$apply();
    });

    it('should return the correct private access information when containerName is specified', function(){
      target.getContainerAccessInformation('container1').then(function(result){
        expect(result).toEqual(response.privateSignatures[0].information);
      });
      $rootScope.$apply();

      target.getContainerAccessInformation('container2').then(function(result){
        expect(result).toEqual(response.privateSignatures[1].information);
      });
      $rootScope.$apply();
    });

    it('should return public access information when creatorId is undefined', function(){
      target.getCreatorAccessInformation(undefined).then(function(result){
        expect(result).toEqual(response.publicSignature);
      });
      $rootScope.$apply();
    });

    it('should return public access information when containerName is undefined', function(){
      target.getContainerAccessInformation(undefined).then(function(result){
        expect(result).toEqual(response.publicSignature);
      });
      $rootScope.$apply();
    });

    it('should return an error when creatorId is unknown', function(){
      target.getCreatorAccessInformation('unknownCreator')
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error instanceof FifthweekError).toBeTruthy(); });
      $rootScope.$apply();
    });

    it('should return an error when containerName is unknown', function(){
      target.getContainerAccessInformation('unknownContainer')
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error instanceof FifthweekError).toBeTruthy(); });
      $rootScope.$apply();
    });
  });

  describe('when getting signatures errors', function(){
    beforeEach(function(){
      accessSignaturesCache.getSignatures.and.returnValue($q.reject('error'));
    });

    it('should return the error when getting public access information', function(){
      target.getPublicAccessInformation()
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error).toBe('error'); });
      $rootScope.$apply();
    });

    it('should return the error when getting creator access information', function(){
      target.getCreatorAccessInformation('creator1')
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error).toBe('error'); });
      $rootScope.$apply();
    });

    it('should return the error when getting container access information', function(){
      target.getContainerAccessInformation('container1')
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error).toBe('error'); });
      $rootScope.$apply();
    });
  });
});

