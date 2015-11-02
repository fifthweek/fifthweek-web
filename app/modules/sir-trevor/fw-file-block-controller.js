angular.module('webApp').controller('fwFileBlockCtrl',
  function($q, $scope) {
    'use strict';

    var model = {
      fileUploaded: false,
      fileData: undefined
    };

    $scope.model = model;

    $scope.onUploadStarted = function(){
      if($scope.onUploadStartedDelegate){
        $scope.onUploadStartedDelegate();
      }
    };

    $scope.onUploadComplete = function(data) {
      model.fileUploaded = true;
      model.fileData = { fileId: data.fileId, containerName: data.containerName, fileName: data.file.name };

      if($scope.onUploadCompleteDelegate){
        $scope.onUploadCompleteDelegate({ data: model.fileData });
      }
    };

    this.initialize = function(){
      model.fileData = { fileId: $scope.fileId, containerName: $scope.containerName, fileName: $scope.fileName };

      if($scope.fileId && $scope.containerName && $scope.fileName){
        model.fileUploaded = true;
      }
    };
  });
