angular.module('webApp').controller('createSubscriptionCtrl',
  function($rootScope, $scope, $state, calculatedStates, subscriptionService) {
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
        $rootScope.debugLines = $rootScope.debugLines || [];
        $rootScope.debugLines.push('subscriptionService.hasSubscription 1 = ' + subscriptionService.hasSubscription);
        $state.go(calculatedStates.getDefaultState());
        $rootScope.debugLines.push('subscriptionService.hasSubscription 2 = ' + subscriptionService.hasSubscription);
      });
    };
  }
);
