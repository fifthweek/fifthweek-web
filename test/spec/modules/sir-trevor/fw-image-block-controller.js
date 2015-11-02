describe('fw-image-block-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var blobImageControlFactory;
  var blobImage;

  beforeEach(function() {

    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    blobImage = jasmine.createSpyObj('blobImage', ['update']);
    blobImageControlFactory.createControl.and.returnValue(blobImage);

    module('webApp');
    module(function($provide) {
      $provide.value('blobImageControlFactory', blobImageControlFactory);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwImageBlockCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set imageUploaded to false', function(){
      expect($scope.model.imageUploaded).toBe(false);
    });

    it('should set processingImage to false', function(){
      expect($scope.model.processingImage).toBe(false);
    });

    it('should set fileData to undefined', function(){
      expect($scope.model.fileData).toBeUndefined();
    });

    it('should create the blobImage object', function(){
      expect(blobImageControlFactory.createControl).toHaveBeenCalledWith();
      expect($scope.blobImage).toBe(blobImage);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('onBlobImageUpdateComplete', function(){
      beforeEach(function(){
        $scope.model.processingImage = false;
        $scope.model.fileData = {};
      });

      describe('when onProcessingCompleteDelegate not defined', function(){
        beforeEach(function(){
          target.internal.onBlobImageUpdateComplete({ renderSize: 'renderSize' });
        });

        it('should set processingImage to false', function(){
          expect($scope.model.processingImage).toBe(false);
        });

        it('should set the renderSize', function(){
          expect($scope.model.fileData.renderSize).toBe('renderSize');
        });
      });

      describe('when onProcessingCompleteDelegate is defined', function(){
        beforeEach(function(){
          $scope.onProcessingCompleteDelegate = jasmine.createSpy('onProcessingCompleteDelegate');
          target.internal.onBlobImageUpdateComplete({ renderSize: 'renderSize' });
        });

        it('should set processingImage to false', function(){
          expect($scope.model.processingImage).toBe(false);
        });

        it('should set the renderSize', function(){
          expect($scope.model.fileData.renderSize).toBe('renderSize');
        });

        it('should call the delegate', function(){
          expect($scope.onProcessingCompleteDelegate).toHaveBeenCalledWith({ data: { renderSize: 'renderSize' }});
        });
      });
    });

    describe('onUploadStarted', function(){
      describe('when onUploadeStartedDelegate not defined', function(){
        it('should not error', function(){
          $scope.onUploadStarted();
        });
      });
      describe('when onUploadeStartedDelegate is defined', function(){
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
        input = { fileId: 'fileId', containerName: 'containerName'};
        expectedFileData = { fileId: 'fileId', containerName: 'containerName' };
        $scope.onUploadComplete(input);
      });

      it('should set imageUploaded to true', function(){
        expect($scope.model.imageUploaded).toBe(true);
      });

      it('should set processingImage to true', function(){
        expect($scope.model.processingImage).toBe(true);
      });

      it('should set fileData', function(){
        expect($scope.model.fileData).toEqual(expectedFileData);
      });

      it('should update the blob image', function(){
        expect(blobImage.update).toHaveBeenCalledWith('containerName', 'fileId', false, target.internal.onBlobImageUpdateComplete);
      });
    });

    describe('when initialize is called', function(){
      describe('when existing file set', function(){
        beforeEach(function(){
          $scope.fileId = 'fileId';
          $scope.containerName = 'containerName';
          $scope.renderSize = 'renderSize';

          target.initialize();
        });

        it('should set fileData', function(){
          expect($scope.model.fileData).toEqual({ fileId: 'fileId', containerName: 'containerName', renderSize: 'renderSize' });
        });

        it('should set imageUploaded to true', function(){
          expect($scope.model.imageUploaded).toBe(true);
        });

        it('should update the blob image', function(){
          expect(blobImage.update).toHaveBeenCalledWith('containerName', 'fileId', true);
        });
      });

      describe('when existing file not set', function(){
        beforeEach(function(){
          target.initialize();
        });

        it('should set fileData', function(){
          expect($scope.model.fileData).toEqual({ fileId: undefined, containerName: undefined, renderSize: undefined });
        });

        it('should set imageUploaded to false', function(){
          expect($scope.model.imageUploaded).toBe(false);
        });

        it('should update the blob image', function(){
          expect(blobImage.update).toHaveBeenCalledWith();
        });
      });
    });
  });
});
