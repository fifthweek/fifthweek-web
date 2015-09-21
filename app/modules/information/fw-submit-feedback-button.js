angular.module('webApp')
  .constant('fwSubmitFeedbackButtonConstants',{
    defaultTitle: 'Send us some feedback!',
    defaultButtonText: 'Feedback',
    defaultCallToAction: 'Feedback'
  })
  .directive('fwSubmitFeedbackButton',
  function ($modal, fwSubmitFeedbackButtonConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        title: '@?',
        buttonText: '@?',
        callToAction: '@?',
        mode: '@?'
      },
      replace: true,
      templateUrl: 'modules/information/fw-submit-feedback-button.html',
      link: function(scope) {

        var modalAttributes = {
          title: scope.title || fwSubmitFeedbackButtonConstants.defaultTitle,
          buttonText: scope.buttonText || fwSubmitFeedbackButtonConstants.defaultButtonText,
          mode: scope.mode
        };

        scope.callToAction = scope.callToAction || fwSubmitFeedbackButtonConstants.defaultCallToAction;

        scope.click = function(){
          return $modal
            .open({
              controller: 'submitFeedbackDialogCtrl',
              templateUrl: 'modules/information/submit-feedback-dialog.html',
              size: 'sm',
              animation: false,
              resolve: {
                attributes: function() { return modalAttributes; }
              }
            }).result;
        };
      }
    };
  });
