angular.module('webApp').controller('fullSizeImageModalCtrl',
  function($scope, $modalInstance, imagePath) {
    'use strict';
    $scope.imagePath = imagePath;
});
