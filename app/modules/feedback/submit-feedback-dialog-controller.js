angular.module('webApp').controller(
  'submitFeedbackDialogCtrl',
  function($q, $scope, membershipStub) {
    'use strict';

    var pages = $scope.pages = {
      form: 0,
      done: 1
    };

    $scope.model = {
      page: pages.form,
      trackingEventTitle: 'Send Feedback',
      trackingEventCategory: 'Feedback',
      input: {
        message: ''
      }
    };

    $scope.submitFeedback = function() {
      return membershipStub.postFeedback($scope.model.input)
        .then(function() {
          $scope.model.page = pages.done;
        });
    };
  }
);
