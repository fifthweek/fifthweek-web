angular.module('webApp').controller('formInputDeleteCtrl', function ($q, $scope, $modal) {
  'use strict';

  $scope.confirmationText = {
    value: ''
  };

  $scope.itemTypeCapitalized = _.capitalize($scope.itemType)

  $scope.questionDelete = function() {
    $scope.modal = $modal.open({
      scope: $scope,
      templateUrl: 'views/partials/form-input-delete-confirm.html'
    });
  };

  $scope.confirmDelete = function() {
    return $q.when($scope.delete())
      .finally(function() {
        $scope.modal.close();
      }
    );
  };
});
