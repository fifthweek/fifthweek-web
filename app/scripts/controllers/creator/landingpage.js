angular.module('webApp').controller(
  'landingPageCtrl', ['$scope',
  function($scope) {
    'use strict';

    (function subscriptions()  {

      $scope.subscriptions = {
        basic:true,
        extras:false
      }

      $scope.$watch('subscriptions.basic', function() {
        if($scope.subscriptions.basic === true) {
          $scope.subscriptions.extras = false;
        }
      });

      $scope.$watch('subscriptions.extras', function() {
        if($scope.subscriptions.extras === true) {
          $scope.subscriptions.basic = false;
        }
      });

    }());

  }
]);
