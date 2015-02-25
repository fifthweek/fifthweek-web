angular.module('webApp').controller('deleteLinkCtrl', function ($q, $scope, $modal) {
  'use strict';

  $scope.verifyDelete = function() {
    $modal.open({
      controller: "deleteVerificationCtrl",
      templateUrl: 'views/partials/delete-verification.html',
      size: $scope.item ? undefined : 'sm',
      resolve: {
        deleteContext: function() {
          return {
            item: $scope.item,
            itemType: $scope.itemType,
            dataEventTitle: $scope.dataEventTitle,
            dataEventCategory: $scope.dataEventCategory,
            action: $scope.delete
          };
        }
      }
    });
  };
});
