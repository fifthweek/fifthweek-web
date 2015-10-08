describe('azure blob upload', function(){
  'use strict';

  var target;
  var utilities;
  var logService;
  var $rootScope;
  var $q;
  var azureBlobStub;

  var largeBlob;
  var smallBlob;
  var contentType = 'image/gif';

  var config;

  var createBlob = function(length){
    var bytes = new Uint8Array(length);
    return new Blob([bytes], { type: contentType });
  };

  beforeEach(function(){
    utilities = jasmine.createSpyObj('utilities', ['getHttpError']);
    logService = jasmine.createSpyObj('logService', ['error']);
    azureBlobStub = jasmine.createSpyObj('azureBlobStub', ['putBlockBlob', 'commitBlockList']);

    module('webApp');
    module(function($provide) {
      $provide.value('utilities', utilities);
      $provide.value('logService', logService);
      $provide.value('azureBlobStub', azureBlobStub);
    });

    inject(function($injector) {
      target = $injector.get('azureBlobUpload');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
    });

    largeBlob = createBlob(5000);
    smallBlob = createBlob(500);

    config = {
      uri: 'blobs.com/a/b',
      signature: '?sas',
      file: undefined,
      progress: undefined,
      complete: undefined,
      error: undefined,
      blockSize: undefined
    };
  });

  var onAzureCalled = function(){
    if(!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };

  describe('when the block size is an exact multiple of the file size', function(){

    beforeEach(function(){
      config.blockSize = 500;
      config.azureCalled = onAzureCalled;
      azureBlobStub.putBlockBlob.and.returnValue($q.when());
      azureBlobStub.commitBlockList.and.returnValue($q.when());
    });

    it('should upload the small blob in one chunk', function(done){
      config.file = smallBlob;
      target.upload(config)
        .finally(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(1);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[1]).toBe('00000000');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[2].length).toBe(500);

          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1].length).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][0]).toBe('00000000');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[2]).toBe(contentType);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });

    it('should upload the large blob in one chunk', function(done){
      config.file = largeBlob;
      target.upload(config)
        .finally(function() {
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(10);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[1]).toBe('00000000');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[2].length).toBe(500);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(9)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(9)[1]).toBe('00000009');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(9)[2].length).toBe(500);

          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1].length).toBe(10);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][0]).toBe('00000000');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][9]).toBe('00000009');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[2]).toBe(contentType);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

  describe('when the block size is not an exact multiple of the file size', function(){

    beforeEach(function(){
      config.blockSize = 400;
      config.azureCalled = onAzureCalled;
      azureBlobStub.putBlockBlob.and.returnValue($q.when());
      azureBlobStub.commitBlockList.and.returnValue($q.when());
    });

    it('should upload the small blob in one chunk', function(done){
      config.file = smallBlob;
      target.upload(config)
        .finally(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(2);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[1]).toBe('00000000');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[2].length).toBe(400);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(1)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(1)[1]).toBe('00000001');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(1)[2].length).toBe(100);

          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1].length).toBe(2);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][0]).toBe('00000000');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][1]).toBe('00000001');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[2]).toBe(contentType);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });

    it('should upload the large blob in one chunk', function(done){
      config.file = largeBlob;
      target.upload(config)
        .finally(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(13);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[1]).toBe('00000000');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[2].length).toBe(400);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(12)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(12)[1]).toBe('00000012');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(12)[2].length).toBe(200);

          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1].length).toBe(13);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][0]).toBe('00000000');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][12]).toBe('00000012');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[2]).toBe(contentType);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

  describe('when the block size larger than file size', function(){

    beforeEach(function(){
      config.blockSize = 40000;
      config.azureCalled = onAzureCalled;
      azureBlobStub.putBlockBlob.and.returnValue($q.when());
      azureBlobStub.commitBlockList.and.returnValue($q.when());
    });

    it('should upload the small blob in one chunk', function(done){
      config.file = smallBlob;
      target.upload(config)
        .finally(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(1);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[1]).toBe('00000000');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[2].length).toBe(500);

          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1].length).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][0]).toBe('00000000');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[2]).toBe(contentType);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });

    it('should upload the large blob in one chunk', function(done){
      config.file = largeBlob;
      target.upload(config)
        .finally(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(1);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[1]).toBe('00000000');
          expect(azureBlobStub.putBlockBlob.calls.argsFor(0)[2].length).toBe(5000);

          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[0]).toBe(config.uri + config.signature);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1].length).toBe(1);
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[1][0]).toBe('00000000');
          expect(azureBlobStub.commitBlockList.calls.argsFor(0)[2]).toBe(contentType);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

  describe('when azure throws an error during block blob upload', function(){

    beforeEach(function(){
      config.blockSize = 400;
      config.azureCalled = onAzureCalled;

      var i = 0;
      azureBlobStub.putBlockBlob.and.callFake(function(){
        if(i === 2){
          return $q.reject('blockBlobFail');
        }

        ++i;
        return $q.when();
      });

      azureBlobStub.commitBlockList.and.returnValue($q.when());
    });

    it('should upload the large blob in one chunk', function(done){
      config.file = largeBlob;
      target.upload(config)
        .then(function(){
          expect('The upload should not have completed successfully.').toBeUndefined();
        })
        .catch(function(error){
          expect(error).toBe('blockBlobFail');
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(3);
          expect(azureBlobStub.commitBlockList.calls.count()).toBe(0);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

  describe('when azure throws an error during block list commit', function(){

    beforeEach(function(){
      config.blockSize = 400;
      config.azureCalled = onAzureCalled;

      azureBlobStub.putBlockBlob.and.returnValue($q.when());
      azureBlobStub.commitBlockList.and.returnValue($q.reject('commitFail'));
    });

    it('should upload the large blob in one chunk', function(done){
      config.file = largeBlob;
      target.upload(config)
        .then(function(){
          expect('The upload should not have completed successfully.').toBeUndefined();
        })
        .catch(function(error){
          expect(error).toBe('commitFail');
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(13);
          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

  describe('when progress is used', function(){

    var progressValues = [];

    beforeEach(function(){
      config.blockSize = 400;
      config.azureCalled = onAzureCalled;

      config.progress = function(percentComplete){
        progressValues.push(percentComplete);
      };

      azureBlobStub.putBlockBlob.and.returnValue($q.when());
      azureBlobStub.commitBlockList.and.returnValue($q.when());
    });

    it('should not stop the upload from completing', function(done){
      config.file = largeBlob;
      target.upload(config)
        .then(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(13);
          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);

          expect(progressValues.length).toBe(13);
          expect(progressValues[progressValues.length - 1]).toBe('100.00');
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

  describe('when progress callback throws an error', function(){

    beforeEach(function(){
      config.blockSize = 400;
      config.azureCalled = onAzureCalled;

      var i = 0;
      config.progress = function(){
        if(i === 2){
          throw 'progressFail';
        }

        ++i;
      };

      azureBlobStub.putBlockBlob.and.returnValue($q.when());
      azureBlobStub.commitBlockList.and.returnValue($q.when());
    });

    it('should not stop the upload from completing', function(done){
      config.file = largeBlob;
      target.upload(config)
        .then(function(){
          expect(azureBlobStub.putBlockBlob.calls.count()).toBe(13);
          expect(azureBlobStub.commitBlockList.calls.count()).toBe(1);

          expect(logService.error).toHaveBeenCalled();
        })
        .catch(function(error){
          expect(error).toBeUndefined();
        })
        .finally(done);
    });
  });

});

