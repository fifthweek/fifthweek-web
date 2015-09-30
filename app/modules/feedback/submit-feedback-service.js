angular.module('webApp').factory('submitFeedbackService',
  function($modal) {
    'use strict';

    var service = {};

    service.showDialog = function(){
      return $modal
        .open({
          controller: 'submitFeedbackDialogCtrl',
          templateUrl: 'modules/feedback/submit-feedback-dialog.html',
          size: 'md',
          animation: false
        }).result;
    };

    return service;
  });
