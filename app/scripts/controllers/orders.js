angular.module('webApp').controller(
  'OrdersCtrl', ['$scope', 'ordersService',
    function($scope, ordersService) {
      'use strict';

      $scope.orders = [];

      ordersService.getOrders().then(
      function(results) {
        $scope.orders = results.data;
      }, 
      function() {
        //alert(error.data.message);
      });

    }
  ]);