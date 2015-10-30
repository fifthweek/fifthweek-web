// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp')
  .constant('formConstants', {
    formSubmittingEvent: 'formSubmitting'
  })
  .directive('fwFormSubmit',
  function ($q, wrapUserAction, $rootScope, formConstants) {
  'use strict';

  return {
    restrict: 'A',
    require: '^form',
    scope: {
      canSubmit: '&',
      fwFormSubmit: '&',
      errorMessage: '=?'
    },
    link: function(scope, element, attrs, form) {
      var canSubmit = attrs.canSubmit ? scope.canSubmit : null;
      var submit = scope.fwFormSubmit;

      if (form === undefined) {
        throw new FifthweekError('Must be within a form');
      }

      if (!canSubmit) {
        canSubmit = function() {
          return form.$valid && form.$dirty;
        };
      }

      form.isSubmitting = false;
      form.hasAttemptedSubmit = false;
      form.hasSubmitted = false;
      form.submissionSucceeded = false;
      form.message = '';

      element.bind('click', function() {

        form.hasAttemptedSubmit = true;

        $rootScope.$broadcast(formConstants.formSubmittingEvent);

        if (!canSubmit()) {
          return $q.when();
        }

        form.isSubmitting = true;
        form.submissionSucceeded = false;
        form.message = '';
        scope.errorMessage = '';

        if (!attrs.hasOwnProperty('ngDisabled')) {
          element.addClass('disabled').attr('disabled', 'disabled');
        }

        var loadingText = element.data('loading-text');
        if(loadingText){
          element.data('resetText', element.html());
          element.html(loadingText);
        }

        var submitMetadata = {
          eventTitle: element.data('event-title'),
          eventCategory: element.data('event-category')
        };

        return wrapUserAction(submit, submitMetadata).then(function(errorMessage) {
          if (errorMessage) {
            form.message = errorMessage;
            scope.errorMessage = errorMessage;
          }
          else {
            form.submissionSucceeded = true;
          }

          form.hasSubmitted = true;
          form.isSubmitting = false;

          if (!attrs.hasOwnProperty('ngDisabled')) {
            element.removeClass('disabled').removeAttr('disabled');
          }

          var resetText = element.data('resetText');
          if(resetText){
            element.html(resetText);
          }
        });
      });
    }
  };
});
