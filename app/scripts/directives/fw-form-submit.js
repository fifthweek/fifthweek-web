// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp').directive('fwFormSubmit',
  function ($q, analytics, errorFacade) {
  'use strict';

  return {
    restrict: 'A',
    require: '^form',
    scope: {
      canSubmit: '&',
      fwFormSubmit: '&'
    },
    link: function(scope, element, attrs, form) {
      var canSubmit = attrs.canSubmit ? scope.canSubmit : null;
      var submit = scope.fwFormSubmit;

      if (form === undefined) {
        throw new FifthweekError('Must be within a form');
      }

      if (!_.isFunction(submit)) {
        throw new FifthweekError('"fwFormSubmit" attribute must reference a function name');
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

        if (!canSubmit()) {
          return $q.when();
        }

        form.isSubmitting = true;
        form.submissionSucceeded = false;
        form.message = '';

        if (!attrs.hasOwnProperty('ngDisabled')) {
          element.addClass('disabled').attr('disabled', 'disabled');
        }

        var loadingText = element.data('loading-text');
        if(loadingText){
          element.data('resetText', element.html());
          element.html(loadingText);
        }

        return $q.when(submit()).then(
          function(){
            form.submissionSucceeded = true;
            var eventTitle = element.data('event-title');
            var eventCategory = element.data('event-category');
            if(eventTitle && eventCategory){
              analytics.eventTrack(eventTitle,  eventCategory);
            }
          },
          function(error){
            return errorFacade.handleError(error, function(message) {
              form.message = message;
            });
          })
          .finally(function() {
            form.hasSubmitted = true;

            if (!attrs.hasOwnProperty('ngDisabled')) {
              element.removeClass('disabled').removeAttr('disabled');
            }

            var resetText = element.data('resetText');
            if(resetText){
              element.html(resetText);
            }

            form.isSubmitting = false;
          });
      });
    }
  };
});
