describe('file upload controller', function(){
  'use strict';

  var $q;

  var $scope;
  var fileUploadStub;
  var azureBlobUpload;
  var utilities;
  var target;

  beforeEach(function() {
    fileUploadStub = jasmine.createSpyObj('fileUploadStub', ['putBlockBlob', 'commitBlockList']);
    azureBlobUpload = jasmine.createSpyObj('azureBlobUpload', ['upload']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);

    module('webApp');
    module(function($provide) {
      $provide.value('fileUploadStub', fileUploadStub);
      $provide.value('azureBlobUpload', azureBlobUpload);
      $provide.value('utilities', utilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
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
    })
  });
});
