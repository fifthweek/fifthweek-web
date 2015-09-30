angular.module('webApp')
  .constant('blobImageCtrlConstants', {
    initialWaitMilliseconds: 3000,
    updateEvent: 'update'
  })
  .controller('blobImageCtrl', function ($scope, $q, $timeout, blobImageCtrlConstants, azureUriService, errorFacade) {
    'use strict';

    $scope.model = {
      imageUri: undefined,
      renderSize: undefined,
      errorMessage: undefined,
      updating: false
    };

    var cancellationToken;

    var handleUpdateEvent = function(event, containerName, fileId, thumbnail, availableImmediately, completeCallback){
      $scope.model.errorMessage = undefined;
      $scope.model.imageUri = undefined;

      if (cancellationToken) {
        cancellationToken.isCancelled = true;
        cancellationToken = undefined;
      }

      if (!fileId) {
        $scope.model.updating = false;
        return $q.when();
      }

      cancellationToken = {};
      $scope.model.updating = true;

      var getImageInformation = function() {
        return azureUriService.getAvailableImageInformation(containerName, fileId, thumbnail, cancellationToken);
      };

      var imageInformationPromise;
      if (availableImmediately) {
        imageInformationPromise = getImageInformation();
      }
      else {
        imageInformationPromise = $timeout(getImageInformation, blobImageCtrlConstants.initialWaitMilliseconds);
      }

      imageInformationPromise
        .then(function(imageInformation) {
          $scope.model.imageUri = imageInformation.uri;
          $scope.model.renderSize = undefined;
          if(imageInformation.width && imageInformation.height && !$scope.fixedAspectRatio){
            $scope.model.renderSize = {
              width: (imageInformation.width / 2) + 'px',
              height: (imageInformation.height / 2) + 'px'
            };
          }
          $scope.model.updating = false;

          if(completeCallback){
            var renderSize;
            if(imageInformation.width && imageInformation.height) {
              renderSize = {
                width: imageInformation.width,
                height: imageInformation.height
              };
            }

            completeCallback(
            {
              renderSize: renderSize
            });
          }
        })
        .catch(function(error) {
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
            $scope.model.updating = false;

            if(completeCallback) {
              completeCallback(
              {
                error: error
              });
            }
          });
        });
    };

    $scope.$on(blobImageCtrlConstants.updateEvent, handleUpdateEvent);
  });
