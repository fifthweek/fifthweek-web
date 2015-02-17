// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp').directive('fwFormSubmit',
  function ($q, analytics, errorFacade) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      formName: '=',
      fwFormSubmit: '&'
    },
    link: function(scope, element, attrs) {
      var form = scope.formName;
      var submit = scope.fwFormSubmit;

      if (form === undefined) {
        throw new FifthweekError('"form" attribute must match an existing form\'s name');
      }

      if (!_.isFunction(submit)) {
        throw new FifthweekError('"fwFormSubmit" attribute must reference a function name');
      }

      form.isSubmitting = false;
      form.hasSubmitted = false;
      form.submissionSucceeded = false;
      form.message = '';

      element.bind('click', function() {

        if (form.$invalid || form.$pristine) {
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
          }).finally(function() {
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
