angular.module('webApp').controller('fwImageBlockCtrl',
  function($q, $scope, blobImageControlFactory, errorFacade) {
    'use strict';

    var model = {
      imageUploaded: false,
      processingImage: false,
      fileData: undefined,
      errorMessage: undefined
    };

    $scope.model = model;

    var internal = this.internal = {};

    $scope.blobImage = blobImageControlFactory.createControl();

    internal.onBlobImageUpdateComplete = function(data){
      model.processingImage = false;

      model.fileData.renderSize = data.renderSize;

      if($scope.onProcessingCompleteDelegate){
        $scope.onProcessingCompleteDelegate({ data: model.fileData });
      }
    };

    $scope.onUploadStarted = function(){
      if($scope.onUploadStartedDelegate){
        $scope.onUploadStartedDelegate();
      }
    };
    $scope.onUploadComplete = function(data) {
      model.imageUploaded = true;
      model.fileData = {
        fileId: data.fileId,
        containerName: data.containerName
      };

      model.processingImage = true;

      $scope.blobImage.update(data.containerName, data.fileId, false, internal.onBlobImageUpdateComplete);
    };

    this.initialize = function(){
      model.fileData = { fileId: $scope.fileId, containerName: $scope.containerName, renderSize: $scope.renderSize };

      if($scope.fileId && $scope.containerName){
        model.imageUploaded = true;
        $scope.blobImage.update($scope.containerName, $scope.fileId, true);
      }
      else{
        $scope.blobImage.update();
      }
    };
  });
