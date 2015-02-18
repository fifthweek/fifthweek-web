angular.module('webApp')
  .controller('fileUploadCtrl', function ($scope, $q, fileUploadStub, azureBlobUpload, utilities) {
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
        return $q.reject(error);
      }
    };

    var reportProgress = function(percentageComplete){
      $scope.model.progress = percentageComplete;
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

      if(!files.length){
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
          var data = response.data;
          fileData = data;
          return azureBlobUpload.upload({
            baseUrl: data.accessInformation.uri,
            sasToken: data.accessInformation.signature,
            file: file,
            progress: reportProgress
          });
        })
        .then(function(){
          return fileUploadStub.postUploadCompleteNotification(fileData.fileId);
        })
        .then(function(){
          return callUploadCompleteCallback({
            fileId: fileData.fileId,
            fileUri: fileData.accessInformation.uri
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
          return $q.when();
        })
        .finally(function(){
          setSubmitting(false);
        });
    };
  });
