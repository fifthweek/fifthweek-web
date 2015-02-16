// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp').directive('fwFormSubmit',
  function ($q, analytics, errorFacade) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      form: '=',
      fwFormSubmit: '&'
    },
    link: function(scope, element, attrs) {

      if (scope.form === undefined) {
        throw new FifthweekError('"form" attribute must match an existing form\'s name')
      }

      scope.form.isSubmitting = false;
      scope.form.hasSubmitted = false;
      scope.form.submissionSucceeded = false;
      scope.form.message = '';

      element.bind('click', function() {

        scope.form.$submitted = true;

        if (scope.form.$invalid || scope.form.$pristine) {
          return $q.when();
        }

        scope.form.isSubmitting = true;
        scope.form.submissionSucceeded = false;
        scope.form.message = '';

        if (!attrs.hasOwnProperty('ngDisabled')) {
          element.addClass('disabled').attr('disabled', 'disabled');
        }

        var loadingText = element.data('loading-text');
        if(loadingText){
          element.data('resetText', element.html());
          element.html(loadingText);
        }

        return $q.when(scope.fwFormSubmit()).then(
          function(){
            scope.form.submissionSucceeded = true;
            var eventTitle = element.data('event-title');
            var eventCategory = element.data('event-category');
            if(eventTitle && eventCategory){
              analytics.eventTrack(eventTitle,  eventCategory);
            }
          },
          function(error){
            return errorFacade.handleError(error, function(message) {
              scope.form.message = message;
            });
          }).finally(function() {
            scope.form.hasSubmitted = true;

            if (!attrs.hasOwnProperty('ngDisabled')) {
              element.removeClass('disabled').removeAttr('disabled');
            }

            var resetText = element.data('resetText');
            if(resetText){
              element.html(resetText);
            }

            scope.form.isSubmitting = false;
          });
      });
    }
  };
});
