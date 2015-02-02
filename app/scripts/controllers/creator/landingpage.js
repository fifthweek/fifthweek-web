angular.module('webApp').controller(
  'landingPageCtrl', ['$scope',
  function($scope) {
    'use strict';

    (function subscriptions()  {

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
        $scope.subscriptions.basic.checked = true;
      };


      //create a blank array to store prices
      var arr = new Array();


      $scope.$watch('channels', function() {

        //iterate through each object
        //if an object has a 'checked' property with true value/boolean
        //add the object's price value to the array
        for (var a in $scope.channels) {
          var checked = $scope.channels[a]['checked'];
          var price = $scope.channels[a]['price'];
          if (checked == true)  {
            console.info('Checked: ', a);
            arr.push(price);

            var totalPrice = 0;

            //add up the array for a total price
            var arrLength = arr.length;
            while (arrLength--) {
              totalPrice += parseFloat(arr[arrLength]);
            }
            totalPrice = totalPrice.toFixed(2);
            $scope.totalPrice = totalPrice;


          }
          if (checked == false)  {
            console.info('UNChecked: ', a);
            /*
            var arrayIndex = arr.indexOf(a);
            if (arrayIndex > -1) {
              arr.splice(arrayIndex, 1);
            }
            */
          }

        }

        

        

        /*
        if($scope.channels.basic.checked === true) {
          console.info('basic checked');
        }
        if($scope.channels.extras.checked === true) {
          console.info('extras checked');
        }
        if($scope.channels.superExtras.checked === true) {
          console.info('another checked');
        }
        */

        console.log('total amount of checked items', totalPrice);

      }, true);


    }());

  }
]);
