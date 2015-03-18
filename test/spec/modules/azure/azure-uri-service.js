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
    azureBlobStub = jasmine.createSpyObj('azureBlobStub', ['checkAvailability']);
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
      spyOn(target, 'getAvailableBlobUri').and.returnValue($q.when('blobUri'));
    });

    it('should forward calls to "get available blob URI"', function() {
      var result;
      target.getAvailableImageUri('container', 'fileId', null, 'cancellation').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.getAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId', 'cancellation');
      expect(result).toBe('blobUri');
    });

    it('should append thumbnail to path if provided', function() {
      var result;
      target.getAvailableImageUri('container', 'fileId', 'thumbnail', 'cancellation').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.getAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId/thumbnail', 'cancellation');
      expect(result).toBe('blobUri');
    });
  });

  describe('when getting available file URI', function() {
    beforeEach(function() {
      spyOn(target, 'getAvailableBlobUri').and.returnValue($q.when('blobUri'));
    });

    it('should forward calls to "get available blob URI"', function() {
      var result;
      target.getAvailableFileUri('container', 'fileId', 'cancellation').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.getAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId', 'cancellation');
      expect(result).toBe('blobUri');
    });
  });

  describe('when attempting getting available file URI', function() {
    beforeEach(function() {
      spyOn(target, 'tryGetAvailableBlobUri').and.returnValue($q.when('blobUri'));
    });

    it('should forward calls to "try get available blob URI"', function() {
      var result;
      target.tryGetAvailableFileUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(target.tryGetAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobUri');
    });
  });

  describe('when getting available blob URI', function() {
    beforeEach(function() {
      spyOn(target, 'tryGetAvailableBlobUri');
    });

    it('should throw cancellation error if immediately cancelled', function() {
      target.getAvailableBlobUri('container', 'fileId', { isCancelled: true })
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

      target.tryGetAvailableBlobUri.and.returnValue($q.when());

      target.getAvailableBlobUri('container', 'fileId', cancellationToken)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof CancellationError).toBe(true);
        });

      expect(target.tryGetAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId');
      target.tryGetAvailableBlobUri.calls.reset();

      cancellationToken.isCancelled = true;
      $timeout.flush();
      $rootScope.$apply();

      expect(target.tryGetAvailableBlobUri).not.toHaveBeenCalled();
    });

    it('should throw displayable error if operation times out', function() {
      target.tryGetAvailableBlobUri.and.returnValue($q.when());

      target.getAvailableBlobUri('container', 'fileId')
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof DisplayableError).toBe(true);
        });

      expect(target.tryGetAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId');
      target.tryGetAvailableBlobUri.calls.reset();

      now.and.returnValue(azureConstants.timeoutMilliseconds + 1);
      $timeout.flush();
      $rootScope.$apply();

      expect(target.tryGetAvailableBlobUri).not.toHaveBeenCalled();
    });

    it('should return file URI if available on initial check', function() {
      target.tryGetAvailableBlobUri.and.returnValue($q.when('blobUri'));

      var result;
      target.getAvailableBlobUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });

      $rootScope.$apply();

      expect(target.tryGetAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobUri');
    });

    it('should return file URI if available on subsequent check', function() {
      target.tryGetAvailableBlobUri.and.returnValue($q.when());

      var result;
      target.getAvailableBlobUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });

      $rootScope.$apply();

      expect(result).toBeUndefined();
      expect(target.tryGetAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId');
      target.tryGetAvailableBlobUri.calls.reset();

      target.tryGetAvailableBlobUri.and.returnValue($q.when('blobUri'));
      $timeout.flush();

      expect(result).toBe('blobUri');
      expect(target.tryGetAvailableBlobUri).toHaveBeenCalledWith('container', 'fileId');
    });
  });

  describe('when trying to get available file URI', function() {
    beforeEach(function() {
      spyOn(target, 'getBlobUri').and.returnValue($q.when('blobUri'));
    });

    it('should return undefined if file is unavailable', function() {
      azureBlobStub.checkAvailability.and.returnValue($q.when(false));

      var result;
      target.tryGetAvailableBlobUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(azureBlobStub.checkAvailability).toHaveBeenCalledWith('blobUri');
      expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBeUndefined();
    });

    it('should return URI if file is available', function() {
      azureBlobStub.checkAvailability.and.returnValue($q.when(true));

      var result;
      target.tryGetAvailableBlobUri('container', 'fileId').then(function(blobUri) {
        result = blobUri;
      });
      $rootScope.$apply();

      expect(azureBlobStub.checkAvailability).toHaveBeenCalledWith('blobUri');
      expect(target.getBlobUri).toHaveBeenCalledWith('container', 'fileId');
      expect(result).toBe('blobUri');
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
