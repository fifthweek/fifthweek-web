angular.module('webApp').controller(
  'registerInterestDialogCtrl',
  function($q, $scope, membershipStub, identifiedUserNotifierConstants, attributes) {
    'use strict';

    var pages = $scope.pages = {
      form: 0,
      done: 1
    };

    $scope.model = {
      page: pages.form,
      title: attributes.title,
      buttonText: attributes.buttonText,
      template: attributes.template,
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

          // Track 'Registration' goal on Twitter.
          twttr.conversion.trackPid('l6dxw', { tw_sale_amount: 0, tw_order_quantity: 0 });
        });
    };
  }
);
