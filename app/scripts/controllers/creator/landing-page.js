angular.module('webApp').controller('landingPageCtrl', function($scope) {
  'use strict';

  $scope.channels = {
    basic: {
      title:'Basic',
      price:'0.50',
      checked:true
    },
    extras: {
      title:'Extras',
      price:'0.75',
      checked:false
    },
    superExtras: {
      title:'Super Extras',
      price:'9.25',
      checked:false
    }
  };

  $scope.checkboxHandler = function(){
    $scope.channels.basic.checked = true;
  };

  $scope.$watch('channels', function() {

    $scope.totalPrice = _($scope.channels)
      .filter(function(channel) {
        return channel.checked === true;
      })
      .reduce(function(sum, channel) {
        return sum + parseFloat(channel.price); },
      0)
      .toFixed(2);

  }, true);
});
