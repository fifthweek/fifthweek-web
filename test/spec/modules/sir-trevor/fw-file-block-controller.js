describe('fw-file-block-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  beforeEach(function() {

    module('webApp');

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwFileBlockCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set fileUploaded to false', function(){
      expect($scope.model.fileUploaded).toBe(false);
    });

    it('should set fileData to undefined', function(){
      expect($scope.model.fileData).toBeUndefined();
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('onUploadStarted', function(){
      describe('when uploaded started delegate not defined', function(){
        it('should not error', function(){
          $scope.onUploadStarted();
        });
      });
      describe('when uploaded started delegate is defined', function(){
        beforeEach(function(){
          $scope.onUploadStartedDelegate = jasmine.createSpy('onUploadStartedDelegate');
          $scope.onUploadStarted();
        });

        it('should call the delegate', function(){
          expect($scope.onUploadStartedDelegate).toHaveBeenCalledWith();
        });
      });
    });

    describe('onUploadComplete', function(){
      var input;
      var expectedFileData;
      beforeEach(function(){
        input = { fileId: 'fileId', containerName: 'containerName', file: { name: 'fileName' }};
        expectedFileData = { fileId: 'fileId', containerName: 'containerName', fileName: 'fileName' };
      });
      describe('when onUploadCompleteDelegate not defined', function(){
        beforeEach(function(){
          $scope.onUploadComplete(input);
        });

        it('should set fileUploaded to true', function(){
          expect($scope.model.fileUploaded).toBe(true);
        });

        it('should set fileData', function(){
          expect($scope.model.fileData).toEqual(expectedFileData);
        });
      });

      describe('when onUploadCompleteDelegate is defined', function(){
        beforeEach(function(){
          $scope.onUploadCompleteDelegate = jasmine.createSpy('onUploadCompleteDelegate');
          $scope.onUploadComplete(input);
        });

        it('should set fileUploaded to true', function(){
          expect($scope.model.fileUploaded).toBe(true);
        });

        it('should set fileData', function(){
          expect($scope.model.fileData).toEqual(expectedFileData);
        });

        it('should call the delegate', function(){
          expect($scope.onUploadCompleteDelegate).toHaveBeenCalledWith({ data: expectedFileData });
        });
      });
    });

    describe('when initialize is called', function(){
      describe('when existing file set', function(){
        beforeEach(function(){
          $scope.fileId = 'fileId';
          $scope.containerName = 'containerName';
          $scope.fileName = 'fileName';

          target.initialize();
        });

        it('should set fileData', function(){
          expect($scope.model.fileData).toEqual({ fileId: 'fileId', containerName: 'containerName', fileName: 'fileName' });
        });

        it('should set fileUploaded to true', function(){
          expect($scope.model.fileUploaded).toBe(true);
        });
      });

      describe('when existing file not set', function(){
        beforeEach(function(){
          target.initialize();
        });

        it('should set fileData', function(){
          expect($scope.model.fileData).toEqual({ fileId: undefined, containerName: undefined, fileName: undefined });
        });

        it('should set fileUploaded to false', function(){
          expect($scope.model.fileUploaded).toBe(false);
        });
      });
    });
  });
});
