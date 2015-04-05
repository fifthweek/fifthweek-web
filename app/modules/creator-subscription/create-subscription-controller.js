angular.module('webApp').controller('createSubscriptionCtrl',
  function($scope, $state, calculatedStates, subscriptionService) {
    'use strict';

    $scope.newSubscriptionData = {
       subscriptionName: '',
       tagline: '',
       basePrice: '1.00'
    };

    var buildDTO = function() {
      var newSubscriptionData = _.cloneDeep($scope.newSubscriptionData);
      newSubscriptionData.basePrice = Math.round(newSubscriptionData.basePrice * 100);
      return newSubscriptionData;
    };

    $scope.continue = function() {
      return subscriptionService.createFirstSubscription(buildDTO()).then(function() {
        $state.go(calculatedStates.getDefaultState());
      });
    };
  }
);
