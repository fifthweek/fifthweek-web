angular.module('webApp').controller(
  'noteCtrl', ['$scope',
  function($scope, $analytics) {
    'use strict';

    $scope.postLater === false;

    $scope.sharePreference = [
      {
        name:'Share with everyone', 
        value:'shareWithAll'
      },
      {
        name:'Share with subscribers', 
        value:'shareWithSubscribers'
      }
    ];

    $scope.sharePreferenceInit = $scope.sharePreference[0];

    $scope.isSubmitting = false;

    $scope.postNow = function() {
      $scope.isSubmitting = true;
    };

    $scope.postToBacklog = function() {
      $scope.isSubmitting = true;
    };



    //datepicker start - put into a service or something
    /*
    $scope.today = function() {
      $scope.date = new Date();
    };
    */
    $scope.date = new Date();


    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    //datepicker end


  }
]);