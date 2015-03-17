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
      spyOn(target, 'getAvailableFileUri').and.returnValue($q.when('fileUri'));
    });

    it('should forward calls to "get available file URI"', function() {
      var result;
      target.getAvailableImageUri('container', 'uri', null, 'cancellation').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(target.getAvailableFileUri).toHaveBeenCalledWith('container', 'uri', 'cancellation');
      expect(result).toBe('fileUri');
    });

    it('should append thumbnail to path if provided', function() {
      var result;
      target.getAvailableImageUri('container', 'uri', 'thumbnail', 'cancellation').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(target.getAvailableFileUri).toHaveBeenCalledWith('container', 'uri/thumbnail', 'cancellation');
      expect(result).toBe('fileUri');
    });
  });

  describe('when getting available file URI', function() {
    beforeEach(function() {
      spyOn(target, 'tryGetAvailableFileUri');
    });

    it('should throw cancellation error if immediately cancelled', function() {
      target.getAvailableFileUri('container', 'uri', { isCancelled: true })
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

      target.tryGetAvailableFileUri.and.returnValue($q.when());

      target.getAvailableFileUri('container', 'uri', cancellationToken)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof CancellationError).toBe(true);
        });

      expect(target.tryGetAvailableFileUri).toHaveBeenCalledWith('container', 'uri');
      target.tryGetAvailableFileUri.calls.reset();

      cancellationToken.isCancelled = true;
      $timeout.flush();
      $rootScope.$apply();

      expect(target.tryGetAvailableFileUri).not.toHaveBeenCalled();
    });

    it('should throw displayable error if operation times out', function() {
      target.tryGetAvailableFileUri.and.returnValue($q.when());

      target.getAvailableFileUri('container', 'uri')
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof DisplayableError).toBe(true);
        });

      expect(target.tryGetAvailableFileUri).toHaveBeenCalledWith('container', 'uri');
      target.tryGetAvailableFileUri.calls.reset();

      now.and.returnValue(azureConstants.timeoutMilliseconds + 1);
      $timeout.flush();
      $rootScope.$apply();

      expect(target.tryGetAvailableFileUri).not.toHaveBeenCalled();
    });

    it('should return file URI if available on initial check', function() {
      target.tryGetAvailableFileUri.and.returnValue($q.when('fileUri'));

      var result;
      target.getAvailableFileUri('container', 'uri').then(function(fileUri) {
        result = fileUri;
      });

      $rootScope.$apply();

      expect(target.tryGetAvailableFileUri).toHaveBeenCalledWith('container', 'uri');
      expect(result).toBe('fileUri');
    });

    it('should return file URI if available on subsequent check', function() {
      target.tryGetAvailableFileUri.and.returnValue($q.when());

      var result;
      target.getAvailableFileUri('container', 'uri').then(function(fileUri) {
        result = fileUri;
      });

      $rootScope.$apply();

      expect(result).toBeUndefined();
      expect(target.tryGetAvailableFileUri).toHaveBeenCalledWith('container', 'uri');
      target.tryGetAvailableFileUri.calls.reset();

      target.tryGetAvailableFileUri.and.returnValue($q.when('fileUri'));
      $timeout.flush();

      expect(result).toBe('fileUri');
      expect(target.tryGetAvailableFileUri).toHaveBeenCalledWith('container', 'uri');
    });
  });

  describe('when trying to get available file URI', function() {
    beforeEach(function() {
      spyOn(target, 'getFileUri').and.returnValue($q.when('fileUri'));
    });

    it('should return undefined if file is unavailable', function() {
      azureBlobStub.checkAvailability.and.returnValue($q.when(false));

      var result;
      target.tryGetAvailableFileUri('container', 'uri').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(azureBlobStub.checkAvailability).toHaveBeenCalledWith('fileUri');
      expect(target.getFileUri).toHaveBeenCalledWith('container', 'uri');
      expect(result).toBeUndefined();
    });

    it('should return URI if file is available', function() {
      azureBlobStub.checkAvailability.and.returnValue($q.when(true));

      var result;
      target.tryGetAvailableFileUri('container', 'uri').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(azureBlobStub.checkAvailability).toHaveBeenCalledWith('fileUri');
      expect(target.getFileUri).toHaveBeenCalledWith('container', 'uri');
      expect(result).toBe('fileUri');
    });
  });

  describe('when getting image URI', function() {
    beforeEach(function() {
      spyOn(target, 'getFileUri').and.returnValue($q.when('fileUri'));
    });

    it('should forward calls to "get file URI"', function() {
      var result;
      target.getImageUri('container', 'uri').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(target.getFileUri).toHaveBeenCalledWith('container', 'uri');
      expect(result).toBe('fileUri');
    });

    it('should append thumbnail to path if provided', function() {
      var result;
      target.getImageUri('container', 'uri', 'thumbnail').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(target.getFileUri).toHaveBeenCalledWith('container', 'uri/thumbnail');
      expect(result).toBe('fileUri');
    });
  });

  describe('when getting file URI', function() {
    it('should combine the URI with the access signature', function() {
      accessSignatures.getContainerAccessInformation.and.returnValue($q.when({ signature: '?signature' }));

      var result;
      target.getFileUri('container', 'uri').then(function(fileUri) {
        result = fileUri;
      });
      $rootScope.$apply();

      expect(accessSignatures.getContainerAccessInformation).toHaveBeenCalledWith('container');
      expect(result).toBe('uri?signature');
    });
  });
});
