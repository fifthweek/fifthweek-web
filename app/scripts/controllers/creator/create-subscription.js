angular.module('webApp').controller('createSubscriptionCtrl',
  function($scope, $state, states, utilities, analytics, subscriptionStub) {
    'use strict';

    $scope.isSubmitting = false;
    $scope.submissionSucceeded = false;
    $scope.message = '';

    $scope.newSubscriptionData = {
       subscriptionName: '',
       tagline: '',
       basePrice: 1.00
    };

    var eventCategory = 'Registration';
    var eventPrefix = 'Subscription creation';

    $scope.continue = function() {
      $scope.isSubmitting = true;
      analytics.eventTrack(eventPrefix + ' submitted', eventCategory);

      var newSubscriptionData = _.clone($scope.newSubscriptionData);
      newSubscriptionData.basePrice = Math.round(newSubscriptionData.basePrice * 100);

      return subscriptionStub.postSubscription(newSubscriptionData).then(function() {
        $scope.submissionSucceeded = true;
        analytics.eventTrack(eventPrefix + ' succeeded', eventCategory);

      }).catch(function(error) {
        analytics.eventTrack(eventPrefix + ' failed', eventCategory);
        $scope.message = utilities.getFriendlyErrorMessage(error);
        $scope.isSubmitting = false;
        return logService.error(error);
      });
    }
  }
);
