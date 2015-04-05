describe('azure URI service', function() {
  'use strict';

  var $rootScope;
  var $q;
  var $timeout;
  var target;
  var azureBlobStub;
  var accessSignatures;
  var azureConstants;

  var now;
  var nowValue = 100;
  var url;
  var signature;
  var container;

  beforeEach(function() {
    azureBlobStub = jasmine.createSpyObj('azureBlobStub', ['tryGetAvailableBlobInformation']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessInformation']);
    now = spyOn(_, 'now');
    now.and.returnValue(nowValue);

    module('webApp', 'stateMock');

    module(function($provide) {
      $provide.value('azureBlobStub', azureBlobStub);
      $provide.value('accessSignatures', accessSignatures);
    });

    inject(function($injector) {
      target = $injector.get('azureUriService');
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      azureConstants = $injector.get('azureConstants');
      $q = $injector.get('$q');
    });

    url = 'url.com/a/b';
    signature = '?signature';
    container = 'container1';
  });

  describe('when getting available image URI', function() {
    beforeEach(function() {
      spyOn(target, 'getAvailableBlobInformation').and.returnValue($q.when('blobInfo'));
    });

    it('should forward calls to "get available blob URI"', function() {
      var result;
      target.getAvailableImageInformation('container', 'fileId', null, 'cancellation').then(function(r) {
        result = r;
      });
      $rootScope.$apply();

      expect(target.getAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId', 'cancellation');
      expect(result).toBe('blobInfo');
    });

    it('should append thumbnail to path if provided', function() {
      var result;
      target.getAvailableImageInformation('container', 'fileId', 'thumbnail', 'cancellation').then(function(r) {
        result = r;
      });
      $rootScope.$apply();

      expect(target.getAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId/thumbnail', 'cancellation');
      expect(result).toBe('blobInfo');
    });
  });

  describe('when getting available file information', function() {
    beforeEach(function() {
      spyOn(target, 'getAvailableBlobInformation').and.returnValue($q.when('blobInfo'));
    });

    it('should forward calls to "get available blob information"', function() {
      var result;
      target.getAvailableFileInformation('container', 'fileId', 'cancellation').then(function(r) {
        result = r;
      });
      $rootScope.$apply();

      expect(target.getAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId', 'cancellation');
      expect(result).toBe('blobInfo');
    });
  });

  describe('when attempting getting available file URI', function() {
    beforeEach(function() {
      spyOn(target, 'tryGetAvailableBlobInformation').and.returnValue($q.when('blobInfo'));
    });

    it('should forward calls to "try get available blob URI"', function() {
      var result;
      target.tryGetAvailableFileInformation('container', 'fileId').then(function(r) {
        result = r;
      });
      $rootScope.$apply();

      expect(target.tryGetAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobInfo');
    });
  });

  describe('when getting available blob URI', function() {
    beforeEach(function() {
      spyOn(target, 'tryGetAvailableBlobInformation');
    });

    it('should throw cancellation error if immediately cancelled', function() {
      target.getAvailableBlobInformation('container', 'fileId', { isCancelled: true })
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof CancellationError).toBe(true);
        });

      $rootScope.$apply();
    });

    it('should throw cancellation error if non-immediately cancelled', function() {
      var cancellationToken = {};

      target.tryGetAvailableBlobInformation.and.returnValue($q.when());

      target.getAvailableBlobInformation('container', 'fileId', cancellationToken)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof CancellationError).toBe(true);
        });

      expect(target.tryGetAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId');
      target.tryGetAvailableBlobInformation.calls.reset();

      cancellationToken.isCancelled = true;
      $timeout.flush();
      $rootScope.$apply();

      expect(target.tryGetAvailableBlobInformation).not.toHaveBeenCalled();
    });

    it('should throw displayable error if operation times out', function() {
      target.tryGetAvailableBlobInformation.and.returnValue($q.when());

      target.getAvailableBlobInformation('container', 'fileId')
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof DisplayableError).toBe(true);
        });

      expect(target.tryGetAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId');
      target.tryGetAvailableBlobInformation.calls.reset();

      now.and.returnValue(azureConstants.timeoutMilliseconds + 1);
      $timeout.flush();
      $rootScope.$apply();

      expect(target.tryGetAvailableBlobInformation).not.toHaveBeenCalled();
    });

    it('should return file URI if available on initial check', function() {
      target.tryGetAvailableBlobInformation.and.returnValue($q.when('blobInfo'));

      var result;
      target.getAvailableBlobInformation('container', 'fileId').then(function(information) {
        result = information;
      });

      $rootScope.$apply();

      expect(target.tryGetAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobInfo');
    });

    it('should return file URI if available on subsequent check', function() {
      target.tryGetAvailableBlobInformation.and.returnValue($q.when());

      var result;
      target.getAvailableBlobInformation('container', 'fileId').then(function(information) {
        result = information;
      });

      $rootScope.$apply();

      expect(result).toBeUndefined();
      expect(target.tryGetAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId');
      target.tryGetAvailableBlobInformation.calls.reset();

      target.tryGetAvailableBlobInformation.and.returnValue($q.when('blobInfo'));
      $timeout.flush();

      expect(result).toBe('blobInfo');
      expect(target.tryGetAvailableBlobInformation).toHaveBeenCalledWith('container', 'fileId');
    });
  });

  describe('when trying to get available blob information', function() {
    beforeEach(function() {
      spyOn(target, 'getBlobUri').and.returnValue($q.when('blobUri'));
    });

    describe('when the file is unavailable', function(){
      var result;
      beforeEach(function(){
        azureBlobStub.tryGetAvailableBlobInformation.and.returnValue($q.when(undefined));
        target.tryGetAvailableBlobInformation('container', 'fileId').then(function(r) {
          result = r;
        });
        $rootScope.$apply();
      });

      it('should request the blob uri', function() {
        expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      });

      it('should request the blob information', function() {
        expect(azureBlobStub.tryGetAvailableBlobInformation).toHaveBeenCalledWith('blobUri');
      });

      it('should return undefined', function() {
        expect(result).toBeUndefined();
      });
    });

    describe('when the file is available', function(){
      var azureResult;
      var result;
      beforeEach(function(){
        azureResult = {};
        azureBlobStub.tryGetAvailableBlobInformation.and.returnValue($q.when(azureResult));
        target.tryGetAvailableBlobInformation('container', 'fileId').then(function(r) {
          result = r;
        });
        $rootScope.$apply();
      });

      it('should request the blob uri', function() {
        expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      });

      it('should request the blob information', function() {
        expect(azureBlobStub.tryGetAvailableBlobInformation).toHaveBeenCalledWith('blobUri');
      });

      it('should return the azure result', function() {
        expect(result).toBe(azureResult);
      });
    });

    describe('when getting blob uri fails', function(){
      var error;
      beforeEach(function(){
        target.getBlobUri.and.returnValue($q.reject('error'));
        target.tryGetAvailableBlobInformation('container', 'fileId').catch(function(r) {
          error = r;
        });
        $rootScope.$apply();
      });

      it('should request the blob uri', function() {
        expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      });

      it('should not request the blob information', function() {
        expect(azureBlobStub.tryGetAvailableBlobInformation).not.toHaveBeenCalled();
      });

      it('should return the error', function() {
        expect(error).toBe('error');
      });
    });

    describe('when getting blob information fails', function(){
      var error;
      beforeEach(function(){
        azureBlobStub.tryGetAvailableBlobInformation.and.returnValue($q.reject('error'));
        target.tryGetAvailableBlobInformation('container', 'fileId').catch(function(r) {
          error = r;
        });
        $rootScope.$apply();
      });

      it('should request the blob uri', function() {
        expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      });

      it('should request the blob information', function() {
        expect(azureBlobStub.tryGetAvailableBlobInformation).toHaveBeenCalledWith('blobUri');
      });

      it('should return the error', function() {
        expect(error).toBe('error');
      });
    });
  });

  describe('when getting image URI', function() {
    beforeEach(function() {
      spyOn(target, 'getBlobUri').and.returnValue($q.when('blobUri'));
    });

    it('should forward calls to "get file URI"', function() {
      var result;
      target.getImageUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobUri');
    });

    it('should append thumbnail to path if provided', function() {
      var result;
      target.getImageUri('container', 'fileId', 'thumbnail').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId/thumbnail');
      expect(result).toBe('blobUri');
    });
  });

  describe('when getting file URI', function() {
    beforeEach(function() {
      spyOn(target, 'getBlobUri').and.returnValue($q.when('blobUri'));
    });

    it('should forward calls to "get file URI"', function() {
      var result;
      target.getFileUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobUri');
    });
  });

  describe('when getting blob URI', function() {
    it('should combine the URI with the access signature', function() {
      accessSignatures.getContainerAccessInformation.and.returnValue($q.when({ uri: 'uri', signature: '?signature' }));

      var result;
      target.getBlobUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(accessSignatures.getContainerAccessInformation).toHaveBeenCalledWith('container');
      expect(result).toBe('uri/fileId?signature');
    });
  });
});
