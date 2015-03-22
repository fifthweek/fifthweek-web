angular.module('webApp').controller('deleteLinkCtrl', function ($scope, deleteVerification) {
  'use strict';

  $scope.verifyDelete = function() {
    deleteVerification.verifyDelete($scope.delete, $scope.eventTitle, $scope.eventCategory, $scope.itemType, $scope.item);
  };
});
