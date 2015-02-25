angular.module('webApp').controller('deleteLinkCtrl', function ($q, $scope, deleteVerification) {
  'use strict';

  $scope.verifyDelete = function() {
    deleteVerification.verifyDelete($scope.delete, $scope.dataEventTitle, $scope.dataEventCategory, $scope.itemType, $scope.item);
  };
});
