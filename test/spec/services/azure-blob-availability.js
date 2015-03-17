describe('azure blob availability service', function() {
  'use strict';

  var $rootScope;
  var $q;
  var target;
  var azureBlobStub;
  var accessSignatures;

  var url;
  var signature;
  var container;

  beforeEach(function() {
    azureBlobStub = jasmine.createSpyObj('azureBlobStub', ['checkAvailability']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessInformation']);

    module('webApp', 'stateMock');

    module(function($provide) {
      $provide.value('azureBlobStub', azureBlobStub);
      $provide.value('accessSignatures', accessSignatures);
    });

    inject(function($injector) {
      target = $injector.get('azureBlobAvailability');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
    });

    url = 'url.com/a/b';
    signature = '?signature';
    container = 'container1';
  });

  describe('when access signatures are available', function(){

    beforeEach(function(){
      accessSignatures.getContainerAccessInformation.and.returnValue($q.when({ signature: '?signature' }));
    });

    describe('when blob is available', function(){

      beforeEach(function(){
        azureBlobStub.checkAvailability.and.returnValue($q.when(true));
      });

      it('should return the uri with signature', function(){
        target.tryGetAvailableFileUrl(url, container)
          .then(function(result){ expect(result).toBe(url + signature); });
        $rootScope.$apply();
      });

      it('should call the access signatures service with the container', function(){
        target.tryGetAvailableFileUrl(url, container);
        $rootScope.$apply();
        expect(accessSignatures.getContainerAccessInformation).toHaveBeenCalledWith(container);
      });

      it('should call the azure blob stub with the uri and signature', function(){
        target.tryGetAvailableFileUrl(url, container);
        $rootScope.$apply();
        expect(azureBlobStub.checkAvailability).toHaveBeenCalledWith(url + signature);
      });
    });

    describe('when blob is not available', function(){
      beforeEach(function(){
        azureBlobStub.checkAvailability.and.returnValue($q.when(false));
      });

      it('should return undefined', function(){
        target.tryGetAvailableFileUrl(url, container)
          .then(function(result){ expect(result).toBeUndefined(); });
        $rootScope.$apply();
      });

      it('should call the access signatures service with the container', function(){
        target.tryGetAvailableFileUrl(url, container);
        $rootScope.$apply();
        expect(accessSignatures.getContainerAccessInformation).toHaveBeenCalledWith(container);
      });

      it('should call the azure blob stub with the uri and signature', function(){
        target.tryGetAvailableFileUrl(url, container);
        $rootScope.$apply();
        expect(azureBlobStub.checkAvailability).toHaveBeenCalledWith(url + signature);
      });
    });

    describe('when checking availability fails', function(){
      beforeEach(function(){
        azureBlobStub.checkAvailability.and.returnValue($q.reject('error'));
      });

      it('should return the error', function(){
        target.tryGetAvailableFileUrl(url, container)
          .then(function(){ fail('This should not occur'); })
          .catch(function(error){ expect(error).toBe('error'); });
        $rootScope.$apply();
      });
    });
  });

  describe('when access signatures are not available', function(){
    beforeEach(function(){
      accessSignatures.getContainerAccessInformation.and.returnValue($q.reject('error'));
    });

    it('should return the error', function(){
      target.tryGetAvailableFileUrl(url, container)
        .then(function(){ fail('This should not occur'); })
        .catch(function(error){ expect(error).toBe('error'); });
      $rootScope.$apply();
    });

    it('should not call the azure blob stub', function(){
      target.tryGetAvailableFileUrl(url, container);
      $rootScope.$apply();
      expect(azureBlobStub.checkAvailability).not.toHaveBeenCalled();
    });
  });
});
