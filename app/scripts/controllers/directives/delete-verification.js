angular.module('webApp').controller('deleteVerificationCtrl', function ($q, $scope, deleteContext) {
  'use strict';

  $scope.model = {
    confirmationText: '',
    itemTypeLowered: deleteContext.itemType.toLowerCase()
  };

  _.merge($scope.model, deleteContext);

  $scope.confirmDelete = function() {
    return $q.when(deleteContext.action())
      .then(function() {
        $scope.$close();
      }
    );
  };
});
