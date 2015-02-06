angular.module('webApp').controller('createSubscriptionCtrl',
  function($scope, subscriptionStub) {
    'use strict';

    $scope.isSubmitting = false;

    $scope.newSubscriptionData = {
       subscriptionName: '',
       tagline: '',
       basePrice: 0
    };

    $scope.continue = function() {
      $scope.isSubmitting = true;
    }
  }
);
