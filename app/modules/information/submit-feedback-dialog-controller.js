angular.module('webApp').controller(
  'submitFeedbackDialogCtrl',
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
      trackingEventTitle: 'Send Feedback',
      trackingEventCategory: 'Feedback',
      input: {
        message: '',
        email: ''
      }
    };

    $scope.submitFeedback = function() {
      return membershipStub.postFeedback($scope.model.input)
        .then(function() {
          if($scope.model.input.email){
            $scope.$emit(identifiedUserNotifierConstants.eventName, { email: $scope.model.input.email });
          }

          $scope.model.page = pages.done;
        });
    };
  }
);
