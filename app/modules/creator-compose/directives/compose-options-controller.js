angular.module('webApp').controller(
  'composeOptionsCtrl',
  function($scope, $modal) {
    'use strict';

    $scope.newPost = function() {
      return $modal.open({
        controller: 'composePostCtrl',
        templateUrl: 'modules/creator-compose/compose-post.html'
      });
    };
  }
);
