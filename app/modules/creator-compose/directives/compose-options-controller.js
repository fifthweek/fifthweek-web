angular.module('webApp').controller(
  'composeOptionsCtrl',
  function($scope, $modal) {
    'use strict';

    $scope.newImage = function() {
      return $modal.open({
        controller: 'composeImageCtrl',
        templateUrl: 'modules/creator-compose/compose-upload.html'
      });
    };

    $scope.newFile = function() {
      return $modal.open({
        controller: 'composeFileCtrl',
        templateUrl: 'modules/creator-compose/compose-upload.html'
      });
    };

    $scope.newAnnouncement = function() {
      return $modal.open({
        controller: 'composeNoteCtrl',
        templateUrl: 'modules/creator-compose/compose-note.html'
      });
    };
  }
);
