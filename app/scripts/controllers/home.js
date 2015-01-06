angular.module('webApp').controller(
  'HomeCtrl', function ($scope, $modal) {
    'use strict';

    $scope.openModal = function(){
      $modal.open({
        templateUrl: 'views/home-modal.html'
      });
    };

  });