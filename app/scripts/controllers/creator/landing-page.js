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
  }

  $scope.checkboxHandler = function(){
    $scope.channels.basic.checked = true;
  };


  $scope.$watch('channels', function() {

    //create a blank array to store prices
    var arr = new Array();

    //iterate through each object
    //if an object has a 'checked' property with true value/boolean
    //add the object's price value to the array
    for (var a in $scope.channels) {
      var checked = $scope.channels[a]['checked'];
      var price = $scope.channels[a]['price'];
      if (checked == true)  {
        //console.info('Checked: ', a);
        arr.push(price);

        var totalPrice = 0;

        //add up the array for a total price
        var arrLength = arr.length;
        while (arrLength--) {
          totalPrice += parseFloat(arr[arrLength]);
        }
      }
      //remove price from array if unchecked
      else if (checked == false)  {
        //console.info('unchecked: ', price);
        arr.splice(a);
      }
    }
    totalPrice = totalPrice.toFixed(2);
    $scope.totalPrice = totalPrice;

  }, true);
});
