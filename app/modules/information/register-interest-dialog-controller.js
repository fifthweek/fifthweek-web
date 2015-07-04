angular.module('webApp').controller(
  'registerInterestDialogCtrl',
  function($q, $scope, membershipStub, identifiedUserNotifierConstants, analyticsEventConstants, attributes) {
    'use strict';

    var pages = $scope.pages = {
      form: 0,
      done: 1
    };

    var trackingEventTitle;

    if (attributes.mode === 'register') {
      trackingEventTitle = analyticsEventConstants.interestRegistration.titleFauxRegistered;
    }
    else if (attributes.mode === 'pricing') {
      trackingEventTitle = analyticsEventConstants.interestRegistration.titlePricingRequested;
    }
    else {
      throw new FifthweekError('Invalid interest mode');
    }

    $scope.model = {
      page: pages.form,
      title: attributes.title,
      buttonText: attributes.buttonText,
      mode: attributes.mode,
      trackingEventTitle: trackingEventTitle,
      trackingEventCategory: analyticsEventConstants.interestRegistration.category,
      input: {
        name: '',
        email: ''
      }
    };

    $scope.registerInterest = function() {
      return membershipStub.postRegisteredInterest($scope.model.input)
        .then(function() {
          $scope.$emit(identifiedUserNotifierConstants.eventName, $scope.model.input);
          $scope.model.page = pages.done;
        });
    };
  }
);
