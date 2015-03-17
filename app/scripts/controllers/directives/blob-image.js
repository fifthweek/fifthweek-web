angular.module('webApp')
  .constant('blobImageCtrlConstants', {
    initialWaitMilliseconds: 3000,
    updateEvent: 'update'
  })
  .controller('blobImageCtrl', function ($scope, $q, $timeout, blobImageCtrlConstants, azureUriService, errorFacade) {
    'use strict';

    $scope.model = {
      imageUri: undefined,
      errorMessage: undefined,
      updating: false
    };

    var cancellationToken;

    var handleUpdateEvent = function(event, uri, containerName, availableImmediately){
      $scope.model.errorMessage = undefined;
      $scope.model.imageUri = undefined;

      if (cancellationToken) {
        cancellationToken.isCancelled = true;
        cancellationToken = undefined;
      }

      if (!uri) {
        $scope.model.updating = false;
        return $q.when();
      }

      cancellationToken = {};
      $scope.model.updating = true;

      var getImageUrl = function() {
        return azureUriService.getImageUrl(containerName, uri, null, cancellationToken);
      };

      var imageUrlPromise;
      if (availableImmediately) {
        imageUrlPromise = getImageUrl();
      }
      else {
        imageUrlPromise = $timeout(getImageUrl, blobImageCtrlConstants.initialWaitMilliseconds);
      }

      imageUrlPromise
        .then(function(imageUrl) {
          $scope.model.imageUri = imageUrl;
          $scope.model.updating = false;
        })
        .catch(function(error) {
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
            $scope.model.updating = false;
          });
        });
    };

    $scope.$on(blobImageCtrlConstants.updateEvent, handleUpdateEvent);
  });
