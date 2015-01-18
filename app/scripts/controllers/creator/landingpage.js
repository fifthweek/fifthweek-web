angular.module('webApp').controller(
  'landingPageCtrl', ['$scope',
  function($scope) {
    'use strict';

    (function subscriptions()  {

      $scope.totalPrice = '';
      $scope.subscriptions = {
        basic: {
          checked:true,
          price:'0.50'
        },
        extras: {
          checked:false,
          price:'0.75'
        }
      }

      $scope.$watch('subscriptions.basic.checked', function() {
        if($scope.subscriptions.basic.checked === true) {
          $scope.subscriptions.extras.checked = false;
          $scope.totalPrice = $scope.subscriptions.basic.price;
        }
      });

      $scope.$watch('subscriptions.extras.checked', function() {
        if($scope.subscriptions.extras.checked === true) {
          $scope.subscriptions.basic.checked = false;
          $scope.totalPrice = $scope.subscriptions.extras.price;
        }
      });

    }());

  }
]);
