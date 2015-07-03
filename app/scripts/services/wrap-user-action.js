angular.module('webApp').factory('wrapUserAction', function($q, errorFacade, analytics) {
    'use strict';

    return function(action, actionMetadata){
      var actionPromise;
      try {
        actionPromise = $q.when(action());
      }
      catch(error) {
        actionPromise = $q.reject(error);
      }

      return actionPromise.then(
        function(){
          if (!actionMetadata) {
            return;
          }

          var eventTwitter = actionMetadata.eventTwitter;
          var eventTitle = actionMetadata.eventTitle;
          var eventCategory = actionMetadata.eventCategory;

          if (eventTwitter) {
            analytics.twitterTrack(eventTwitter);
          }

          if(eventTitle && eventCategory) {
            return analytics.eventTrack(eventTitle,  eventCategory).then(function() {
              // We use results to indicate error messages, so we ensure nothing is returned from
              // this promise as this is a success case.
            });
          }
        },
        function(error){
          return errorFacade.handleErrorInBackground(error);
        });
    };
  }
);
