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
        content: undefined
      }
    };

    $scope.submitFeedback = function() {
      var data = {
        message: $scope.model.input.content.previewText
      };
      return membershipStub.postFeedback(data)
        .then(function() {
          $scope.model.page = pages.done;
        });
    };
  }
);
