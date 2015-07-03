angular.module('webApp').controller(
  'registerInterestDialogCtrl',
  function($q, $scope, membershipStub, identifiedUserNotifierConstants, attributes) {
    'use strict';

    var pages = $scope.pages = {
      form: 0,
      done: 1
    };

    var modeOptions;

    if (attributes.mode === 'register') {
      modeOptions = {
        twitterConversion: 'l6dxw',
        analyticsConversion: 'Faux Registered'
      };
    }
    else if (attributes.mode === 'pricing') {
      modeOptions = {
        twitterConversion: 'l6dy3',
        analyticsConversion: 'Pricing Requested'
      };
    }
    else {
      throw new FifthweekError('Invalid interest mode');
    }

    $scope.model = {
      page: pages.form,
      title: attributes.title,
      buttonText: attributes.buttonText,
      mode: attributes.mode,
      trackingEvent: modeOptions.analyticsConversion,
      trackingEventTwitter: modeOptions.twitterConversion,
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
