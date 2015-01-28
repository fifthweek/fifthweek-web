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

      $scope.checkboxHandler = function(){
        $scope.subscriptions.basic.checked = true;
      };

      $scope.$watch('subscriptions.extras.checked', function() {
        if($scope.subscriptions.extras.checked === true) {
          $scope.totalPrice = +$scope.subscriptions.basic.price + +$scope.subscriptions.extras.price;
        }
        
        if($scope.subscriptions.extras.checked === false) {
          $scope.totalPrice = $scope.subscriptions.basic.price;
        }
        
      });

    }());

  }
]);
