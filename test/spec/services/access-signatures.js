describe('access signatures', function() {
  'use strict';

  var response = {
    timeToLiveSeconds: 1000,
    publicSignature: {
      containerName: 'public',
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

    describe('when getting public access information', function(){
      it('should return public access information', function(){
        target.getPublicAccessInformation().then(function(result){
          expect(result).toEqual(response.publicSignature);
        });
        $rootScope.$apply();
      });
    });

    describe('when getting access information by container name', function(){
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


      it('should return public access information when containerName is undefined', function(){
        target.getContainerAccessInformation(undefined).then(function(result){
          expect(result).toEqual(response.publicSignature);
        });
        $rootScope.$apply();
      });

      it('should return an error when containerName is unknown', function(){
        target.getContainerAccessInformation('unknownContainer')
          .then(function(){ fail('This should not occur.'); })
          .catch(function(error){ expect(error instanceof FifthweekError).toBeTruthy(); });
        $rootScope.$apply();
      });

      describe('when getting a map', function(){
        it('should contain a map of all the signatures', function(){
          target.getContainerAccessMap().then(function(result){
            expect(result).toEqual({
              public: {
                containerName: 'public',
                uri: 'https://files.fifthweek.com/public',
                signature: '?abcd',
                expiry: 1234
              },
              container1: {
                containerName: 'container1',
                uri: 'https://files.fifthweek.com/creator1',
                signature: '?abcd',
                expiry: 1234
              },
              container2: {
                containerName: 'container2',
                uri: 'https://files.fifthweek.com/creator2',
                signature: '?efgh',
                expiry: 1234
              }
            });
          });
          $rootScope.$apply();
        });
      });
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

    it('should return the error when getting container access information', function(){
      target.getContainerAccessInformation('container1')
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error).toBe('error'); });
      $rootScope.$apply();
    });

    it('should return the error when getting container access map', function(){
      target.getContainerAccessMap()
        .then(function(){ fail('This should not occur.'); })
        .catch(function(error){ expect(error).toBe('error'); });
      $rootScope.$apply();
    });
  });
});

