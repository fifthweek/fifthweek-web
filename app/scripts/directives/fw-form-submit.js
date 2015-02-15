// See: https://gist.github.com/thisboyiscrazy/5137781#comment-838257
angular.module('webApp').directive('fwFormSubmit',
  function ($q, analytics, errorFacade, utilities) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var scopeUtilities = utilities.forScope(scope);

      var setMessage = scopeUtilities.createVirtualSetter('message');
      var setSubmissionSucceeded = scopeUtilities.createVirtualSetter('submissionSucceeded');

      scope.isSubmitting = false;
      scope.hasSubmitted = false;
      setSubmissionSucceeded(false);
      setMessage('');

      element.bind('click', function() {

        if (attrs.hasOwnProperty('fwCanSubmitForm')) {
          var canSubmitForm = scope.$apply(attrs.fwCanSubmitForm);
          if(!canSubmitForm){
            return $q.when();
          }
        }

        scope.isSubmitting = true;
        setSubmissionSucceeded(false);
        setMessage('');

        if (!attrs.hasOwnProperty('ngDisabled')) {
          element.addClass('disabled').attr('disabled', 'disabled');
        }

        var loadingText = element.data('loading-text');
        if(loadingText){
          element.data('resetText', element.html());
          element.html(loadingText);
        }

        return $q.when(scope.$apply(attrs.fwFormSubmit)).then(
          function(){
            setSubmissionSucceeded(true);
            var eventTitle = element.data('event-title');
            var eventCategory = element.data('event-category');
            if(eventTitle && eventCategory){
              analytics.eventTrack(eventTitle,  eventCategory);
            }
          },
          function(error){
            return errorFacade.handleError(error, setMessage);
          }).finally(function() {
            scope.hasSubmitted = true;

            if (!attrs.hasOwnProperty('ngDisabled')) {
              element.removeClass('disabled').removeAttr('disabled');
            }

            var resetText = element.data('resetText');
            if(resetText){
              element.html(resetText);
            }

            scope.isSubmitting = false;
          });
      });
    }
  };
});
