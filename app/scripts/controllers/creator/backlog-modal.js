angular.module('webApp').controller('ModalBacklogCtrl',
  function($scope, $modalInstance, post) {
    'use strict';
    $scope.post = post;
});
