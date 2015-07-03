angular.module('webApp').controller(
  'registerInterestDialogCtrl',
  function($q, $scope, membershipStub, identifiedUserNotifierConstants, title, message, buttonText) {
    'use strict';

    var pages = $scope.pages = {
      form: 0,
      done: 1
    };

    $scope.model = {
      page: pages.form,
      message: message,
      title: title,
      buttonText: buttonText,
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
