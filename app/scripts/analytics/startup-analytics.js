angular.module('webApp').run(function(analytics, $rootScope, initialQueryParams, identifiedUserNotifierConstants) {
  'use strict';

  // Angulartics mutates input parameters which causes events to bleed into each other, resulting in erroneous tracking.
  var eventCategory = function() {
    return {category: 'Provenance'};
  };

  initialQueryParams.promise.then(function(queryParams) {
    var emailAddress = queryParams.emailed_to;
    var utmCampaign = queryParams.utm_campaign;
    var utmSource = queryParams.utm_source;
    var utmMedium = queryParams.utm_medium;
    var utmContent = queryParams.utm_content;

    if (emailAddress) {
      analytics.setUserProperties({
        'last opened email from': emailAddress
      });

      $rootScope.$emit(identifiedUserNotifierConstants.eventName, { email: emailAddress });
    }

    if (utmCampaign || utmSource || utmMedium || utmContent) {
      analytics.eventTrack('Arrived from campaign "' +
        utmCampaign + '/' +
        utmSource + '/' +
        utmMedium + '/' +
        utmContent + '"',
        eventCategory());
    }
  });
});

