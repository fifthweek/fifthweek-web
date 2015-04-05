angular.module('webApp').controller('fullSizeImageModalCtrl',
  function($scope, image, imageSource, accessSignatures, postInteractions) {
    'use strict';

    accessSignatures.getContainerAccessInformation(image.containerName)
      .then(function(data) {
        $scope.imagePath = data.uri + '/' + image.fileId + data.signature;
        $scope.image = image;
        $scope.imageSource = imageSource;
      });


    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };
});
