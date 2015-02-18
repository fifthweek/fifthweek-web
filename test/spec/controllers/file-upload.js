describe('file upload controller', function(){
  'use strict';

  var $q;

  var $scope;
  var fileUploadStub;
  var azureBlobUpload;
  var utilities;
  var logService;
  var target;

  var contentType = 'image/gif';
  var fileName = 'image.gif';
  var blob;

  var createBlob = function(length){
    var bytes = new Uint8Array(length);
    var newBlob = new Blob([bytes], { type: contentType });
    newBlob.name = fileName;
    return newBlob;
  };

  beforeEach(function() {
    fileUploadStub = jasmine.createSpyObj('fileUploadStub', ['postUploadRequest', 'postUploadCompleteNotification']);
    azureBlobUpload = jasmine.createSpyObj('azureBlobUpload', ['upload']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    logService = jasmine.createSpyObj('logService', ['error']);

    module('webApp');
    module(function($provide) {
      $provide.value('fileUploadStub', fileUploadStub);
      $provide.value('azureBlobUpload', azureBlobUpload);
      $provide.value('utilities', utilities);
      $provide.value('logService', logService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    blob = createBlob(50);
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fileUploadCtrl', {
        $scope: $scope,
        $q: $q,
        fileUploadStub: fileUploadStub,
        azureBlobUpload: azureBlobUpload,
        utilities: utilities
      });
    });
  };

  describe('when being created', function(){
    it('should detect if File is not supported', function(){
      var value = window.File;
      try{
        window.File = undefined;
        createController();
        expect($scope.model.fileApiSupported).toBeFalsy();
      }
      finally{
        window.File = value;
      }
    });

    it('should detect if FileReader is not supported', function(){
      var value = window.FileReader;
      try{
        window.FileReader = undefined;
        createController();
        expect($scope.model.fileApiSupported).toBeFalsy();
      }
      finally{
        window.FileReader = value;
      }
    });

    it('should detect if FileList is not supported', function(){
      var value = window.FileList;
      try{
        window.FileList = undefined;
        createController();
        expect($scope.model.fileApiSupported).toBeFalsy();
      }
      finally{
        window.FileList = value;
      }
    });

    it('should detect if Blob is not supported', function(){
      var value = window.Blob;
      try{
        window.Blob = undefined;
        createController();
        expect($scope.model.fileApiSupported).toBeFalsy();
      }
      finally{
        window.Blob = value;
      }
    });

    it('should detect if the file API is supported', function(){
      createController();
      expect($scope.model.fileApiSupported).toBeTruthy();
    });

  });

  describe('when created', function(){
    beforeEach(function(){
      createController();

      utilities.getFriendlyErrorMessage.and.callFake(function(error) { return error.message; });
    });

    it('should clear progress and error message when initializing upload', function(){
      $scope.model.progress = 40;
      $scope.model.errorMessage = 'error';
      $scope.upload(undefined);

      expect($scope.model.progress).toBe(0);
      expect($scope.model.errorMessage).toBe('');
    });

    it('should set submitting to true while executing', function(){
      $scope.model.isSubmitting = false;
      $scope.upload(undefined);

      expect($scope.model.isSubmitting).toBe(true);

      $scope.$apply();

      expect($scope.model.isSubmitting).toBe(false);
    });

    it('should report an error if no file purpose is specified', function(){
      $scope.filePurpose = undefined;
      $scope.upload([blob]);
      $scope.$apply();

      expect($scope.model.errorMessage).toBe('No file purpose specified.');
      expect(logService.error).toHaveBeenCalled();
    });

    it('should report an error if no files specified', function(){
      $scope.filePurpose = 'purpose';
      $scope.upload();
      $scope.$apply();

      expect($scope.model.errorMessage).toBe('No files selected.');
      expect(logService.error).toHaveBeenCalled();
    });

    it('should report an error if empty list of files specified', function(){
      $scope.filePurpose = 'purpose';
      $scope.upload([]);
      $scope.$apply();

      expect($scope.model.errorMessage).toBe('No files selected.');
      expect(logService.error).toHaveBeenCalled();
    });

    it('should report an error the file type is not in the accepted file types list', function(){
      $scope.filePurpose = 'purpose';
      $scope.accept = 'image/jpeg,image/tiff';
      $scope.upload([blob]);
      $scope.$apply();

      expect($scope.model.errorMessage).toBe('The selected file type is not supported.');
      expect(logService.error).toHaveBeenCalled();
    });

    describe('when validation passes', function(){
      var uploadRequestData;

      beforeEach(function(){
        $scope.filePurpose = 'purpose';
        $scope.accept = 'image/jpeg,image/gif,image/tiff';

        uploadRequestData = {
          fileId: 'fileId',
          accessInformation: {
            uri: 'uri',
            signature: 'signature'
          }
        };
      });

      it('should upload the data', function(){

        fileUploadStub.postUploadRequest.and.returnValue($q.when({ data: uploadRequestData }));

        $scope.upload([blob]);
        $scope.$apply();

        expect(fileUploadStub.postUploadRequest).toHaveBeenCalledWith({ filePath: fileName, purpose: $scope.filePurpose });

        expect(azureBlobUpload.upload).toHaveBeenCalled();
        var uploadData = azureBlobUpload.upload.calls.first().args[0];
        expect(uploadData.progress).toBeDefined();
        uploadData.progress = undefined;
        expect(uploadData).toEqual({
          uri: uploadRequestData.accessInformation.uri,
          signature: uploadRequestData.accessInformation.signature,
          file: blob,
          progress: undefined
        });

        expect(fileUploadStub.postUploadCompleteNotification).toHaveBeenCalledWith(uploadRequestData.fileId);

        expect($scope.model.errorMessage).toBe('');
        expect($scope.model.isSubmitting).toBe(false);
      });

      it('should call the upload complete callback if specified', function(){

        $scope.onUploadComplete = jasmine.createSpy('onUploadComplete');
        fileUploadStub.postUploadRequest.and.returnValue($q.when({ data: uploadRequestData }));

        $scope.upload([blob]);
        $scope.$apply();

        expect($scope.onUploadComplete).toHaveBeenCalledWith({
          data: {
            fileId: uploadRequestData.fileId,
            fileUri: uploadRequestData.accessInformation.uri
          }
        });

        expect($scope.model.errorMessage).toBe('');
        expect($scope.model.isSubmitting).toBe(false);
      });

      it('should log and ignore errors in the upload complete callback', function(){

        $scope.onUploadComplete = function() { throw 'bad'; };
        fileUploadStub.postUploadRequest.and.returnValue($q.when({ data: uploadRequestData }));

        $scope.upload([blob]);
        $scope.$apply();

        expect($scope.model.errorMessage).toBe('');
        expect($scope.model.isSubmitting).toBe(false);

        expect(logService.error).toHaveBeenCalled();
      });

      it('should update the progress information when the progress callback is called', function(){

        $scope.onUploadComplete = function() { throw 'bad'; };
        fileUploadStub.postUploadRequest.and.returnValue($q.when({ data: uploadRequestData }));

        $scope.upload([blob]);
        $scope.$apply();

        var uploadData = azureBlobUpload.upload.calls.first().args[0];
        uploadData.progress(66);

        expect($scope.model.progress).toBe(66);

        uploadData.progress(77);

        expect($scope.model.progress).toBe(77);
      });

      it('should stop uploading if the upload request fails', function(){

        $scope.onUploadComplete = jasmine.createSpy('onUploadComplete');
        fileUploadStub.postUploadRequest.and.returnValue($q.reject(new ApiError('upload request failed')));

        $scope.upload([blob]);
        $scope.$apply();

        expect(fileUploadStub.postUploadRequest).toHaveBeenCalled();

        expect(azureBlobUpload.upload).not.toHaveBeenCalled();
        expect(fileUploadStub.postUploadCompleteNotification).not.toHaveBeenCalled();
        expect($scope.onUploadComplete).not.toHaveBeenCalled();

        expect($scope.model.errorMessage).toBe('upload request failed');
        expect($scope.model.isSubmitting).toBe(false);
        expect(logService.error).toHaveBeenCalled();
      });

      it('should stop uploading if the blob upload fails', function(){

        $scope.onUploadComplete = jasmine.createSpy('onUploadComplete');
        fileUploadStub.postUploadRequest.and.returnValue($q.when({ data: uploadRequestData }));
        azureBlobUpload.upload.and.returnValue($q.reject(new ApiError('upload failed')));

        $scope.upload([blob]);
        $scope.$apply();

        expect(fileUploadStub.postUploadRequest).toHaveBeenCalled();
        expect(azureBlobUpload.upload).toHaveBeenCalled();

        expect(fileUploadStub.postUploadCompleteNotification).not.toHaveBeenCalled();
        expect($scope.onUploadComplete).not.toHaveBeenCalled();

        expect($scope.model.errorMessage).toBe('upload failed');
        expect($scope.model.isSubmitting).toBe(false);
        expect(logService.error).toHaveBeenCalled();
      });

      it('should stop uploading if the upload complete notification fails', function(){

        $scope.onUploadComplete = jasmine.createSpy('onUploadComplete');
        fileUploadStub.postUploadRequest.and.returnValue($q.when({ data: uploadRequestData }));
        fileUploadStub.postUploadCompleteNotification.and.returnValue($q.reject(new ApiError('upload complete notification failed')));

        $scope.upload([blob]);
        $scope.$apply();

        expect(fileUploadStub.postUploadRequest).toHaveBeenCalled();
        expect(azureBlobUpload.upload).toHaveBeenCalled();
        expect(fileUploadStub.postUploadCompleteNotification).toHaveBeenCalled();

        expect($scope.onUploadComplete).not.toHaveBeenCalled();

        expect($scope.model.errorMessage).toBe('upload complete notification failed');
        expect($scope.model.isSubmitting).toBe(false);
        expect(logService.error).toHaveBeenCalled();
      });
    })
  });
});
