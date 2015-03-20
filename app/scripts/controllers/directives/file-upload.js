angular.module('webApp')
  .controller('fileUploadCtrl', function ($scope, $q, fileUploadStub, azureBlobUpload, utilities, logService) {
    'use strict';

    var callUploadCompleteCallback = function(data){
      try
      {
        var onUploadComplete = $scope.onUploadComplete;
        if (_.isFunction(onUploadComplete)) {
          onUploadComplete({
            data: data
          });
        }
        return $q.when();
      }
      catch(error){
        logService.error(error);
        return $q.when();
      }
    };

    var reportProgress = function(percentageComplete){
      $scope.model.progress = Math.round(percentageComplete);
    };

    var reportError = function(message){
      $scope.model.errorMessage = message;
    };

    var setSubmitting = function(value){
      $scope.model.isSubmitting = value;
    };

    var isFileTypeSupported = function(file){
      if($scope.accept) {
        var acceptedMimeTypes = $scope.accept.split(/[\s,]+/);
        return _.includes(acceptedMimeTypes, file.type);
      }

      return true;
    };

    var performValidation = function(files){
      if(!$scope.filePurpose){
        return $q.reject(new InputValidationError('No file purpose specified.'));
      }

      if(!files || !files.length){
        return $q.reject(new InputValidationError('No files selected.'));
      }

      var file = files[0];

      if(!isFileTypeSupported(file)){
        return $q.reject(new InputValidationError('The selected file type is not supported.'));
      }

      return $q.when(file);
    };

    var performUpload = function(file)
    {
      var fileData;
      return fileUploadStub
        .postUploadRequest({
          filePath: file.name,
          purpose: $scope.filePurpose
        })
        .then(function(response){
          fileData = response.data;
          return azureBlobUpload.upload({
            uri: fileData.accessInformation.uri,
            signature: fileData.accessInformation.signature,
            file: file,
            progress: reportProgress
          });
        })
        .then(function(){
          return fileUploadStub.postUploadCompleteNotification(fileData.fileId);
        })
        .then(function(){
          return callUploadCompleteCallback({
            file: file,
            fileId: fileData.fileId,
            uri: fileData.accessInformation.uri,
            containerName: fileData.accessInformation.containerName
          });
        });
    };

    var fileApiSupported = (window.File && window.FileReader && window.FileList && window.Blob);
    $scope.model = {
      fileApiSupported: fileApiSupported
    };

    $scope.upload = function(files) {
      reportProgress(0);
      reportError('');
      setSubmitting(true);

      return performValidation(files)
        .then(function(file){
          return performUpload(file);
        })
        .catch(function(error) {
          reportError(utilities.getFriendlyErrorMessage(error));
          logService.error(error);
          return $q.when();
        })
        .finally(function(){
          setSubmitting(false);
        });
    };
  });
