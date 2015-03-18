angular.module('webApp').controller('fullSizeImageModalCtrl',
  function($scope, $modalInstance, image, imageSource, accessSignatures, postInteractions) {
    'use strict';

    accessSignatures.getContainerAccessInformation(image.containerName)
      .then(function(data) {
        var uriWithSignature = data.uri + '/' + image.fileId + data.signature;
        $scope.imagePath = uriWithSignature;
        $scope.image = image;
        $scope.imageSource = imageSource;
      });


    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };
});
