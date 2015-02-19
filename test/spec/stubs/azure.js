describe('azure stubs', function(){
  'use strict';

  var target;
  var $httpBackend;

  beforeEach(function(){

    module('webApp');

    inject(function($injector) {
      target = $injector.get('azureBlobStub');
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('when calling putBlockBlob', function(){

    var url;
    var blockId;
    var requestData;

    beforeEach(function(){
      url = 'blah.com/?abc';
      blockId = 'blockId';
      requestData = { test: 1 };
    });

    it('should put the data to azure', function(){
      $httpBackend.expectPUT(url + '&comp=block&blockid=' + blockId, requestData).respond(200);

      var error;
      target.putBlockBlob(url, blockId, requestData).catch(function(e) { error = e; });

      $httpBackend.flush();

      expect(error).toBeUndefined();
    });

    it('should return an AzureError if the call fails', function(){
      $httpBackend.expectPUT(url + '&comp=block&blockid=' + blockId, requestData).respond(500);

      var error;
      target.putBlockBlob(url, blockId, requestData).catch(function(e) { error = e; });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error instanceof AzureError).toBeTruthy();
    });
  });

  describe('when calling commitBlobList', function(){

    var url;
    var blockIds;
    var contentType;

    beforeEach(function(){
      url = 'blah.com/?abc';
      blockIds = [ 'one', 'two', 'three' ];
      contentType = 'image/jpeg';
    });

    it('should put the data to azure', function(){
      var expectedData = '<?xml version="1.0" encoding="utf-8"?><BlockList><Latest>one</Latest><Latest>two</Latest><Latest>three</Latest></BlockList>';
      $httpBackend.expectPUT(url + '&comp=blocklist', expectedData).respond(200);

      var error;
      target.commitBlockList(url, blockIds, contentType).catch(function(e) { error = e; });

      $httpBackend.flush();

      expect(error).toBeUndefined();
    });

    it('should return an AzureError if the call fails', function(){
      $httpBackend.expectPUT(url + '&comp=blocklist').respond(500);

      var error;
      target.commitBlockList(url, blockIds, contentType).catch(function(e) { error = e; });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error instanceof AzureError).toBeTruthy();
    });

    describe('when calling checkAvailability', function(){

      var url;

      beforeEach(function(){
        url = 'blah.com/?abc';
      });

      it('should return true if available', function(){
        $httpBackend.expectHEAD(url).respond(200);

        target.checkAvailability(url)
          .then(function(result){ expect(result).toBe(true); });

        $httpBackend.flush();
      });

      it('should return true if available', function(){
        $httpBackend.expectHEAD(url).respond(404);

        target.checkAvailability(url)
          .then(function(result){ expect(result).toBe(false); });

        $httpBackend.flush();
      });

      it('should return the error if there is an unexpected response', function(){
        $httpBackend.expectHEAD(url).respond(401);

        target.checkAvailability(url)
          .then(function(){ fail('This should not occur'); })
          .catch(function(error){ expect(error instanceof AzureError).toBeTruthy(); });

        $httpBackend.flush();
      });
    });
  });
});
