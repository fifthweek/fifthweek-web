angular.module('webApp')
  .constant('blobImageCtrlConstants', {
    timeoutMilliseconds: 30000,
    checkIntervalMilliseconds: 1500,
    initialWaitMilliseconds: 3000,
    updateEvent: 'update'
  })
  .controller('blobImageCtrl', function ($scope, $q, $timeout, blobImageCtrlConstants, azureBlobAvailability, utilities, logService) {
    'use strict';

    $scope.model = {
      imageUri: undefined,
      errorMessage: undefined,
      updating: false
    };

    var pendingImageData;
    var pendingImageDataExpiry;

    var updateExpiryTime = function(){
      pendingImageDataExpiry = _.now() + (blobImageCtrlConstants.timeoutMilliseconds);
    };

    var assignImage = function(urlWithSignature){
      pendingImageData = undefined;
      $scope.model.imageUri = urlWithSignature;
      $scope.model.updating = false;
      return $q.when();
    };

    var waitForImage = function(){

      if(_.now() > pendingImageDataExpiry){
        return $q.reject(new DisplayableError('Timeout', 'Timed out waiting for image ' + pendingImageData.fileUri + ' to be available.'));
      }

      return azureBlobAvailability.checkAvailability(pendingImageData.fileUri, pendingImageData.containerName)
        .then(function(urlWithSignature){
          if(urlWithSignature){
            return assignImage(urlWithSignature);
          }
          else {
            return pauseAndWaitForImage(blobImageCtrlConstants.checkIntervalMilliseconds);
          }
        });
    };

    var pauseAndWaitForImage = function(intervalMilliseconds){
      return $timeout(waitForImage, intervalMilliseconds);
    };

    var handleUpdateEvent = function(event, fileUri, containerName){
      $scope.model.errorMessage = undefined;
      $scope.model.imageUri = undefined;
      $scope.model.updating = true;
      updateExpiryTime();

      var isAlreadyWaiting = pendingImageData !== undefined;
      pendingImageData = {
        fileUri: fileUri,
        containerName: containerName
      };

      if(!isAlreadyWaiting){
        return pauseAndWaitForImage(blobImageCtrlConstants.initialWaitMilliseconds)
          .catch(function(error){
            logService.error(error);
            $scope.model.errorMessage = utilities.getFriendlyErrorMessage(error);
            $scope.model.updating = false;
            pendingImageData = undefined;
          });
      }
    };

    $scope.$on(blobImageCtrlConstants.updateEvent, handleUpdateEvent);
  });
