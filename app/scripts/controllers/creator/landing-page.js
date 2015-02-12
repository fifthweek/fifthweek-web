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

    //create a blank array to store prices
    var selectedChannels = new Array();

    //iterate through each object
    //if an object has a 'checked' property with true value/boolean
    //add the object's price value to the array
    for (var channel in $scope.channels) {
      var checked = $scope.channels[channel].checked;
      var price = $scope.channels[channel].price;
      if (checked === true)  {
        //console.info('Checked: ', a);
        selectedChannels.push(price);

        var totalPrice = 0;

        //add up the array for a total price
        var arrLength = selectedChannels.length;
        while (arrLength--) {
          totalPrice += parseFloat(selectedChannels[arrLength]);
        }
      }
      //remove price from array if unchecked
      else if (checked === false)  {
        //console.info('unchecked: ', price);
        selectedChannels.splice(channel);
      }
    }
    totalPrice = totalPrice.toFixed(2);
    $scope.totalPrice = totalPrice;

  }, true);
});
