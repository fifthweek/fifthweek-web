angular.module('webApp').run(function(analytics, $rootScope, $location, identifiedUserNotifierConstants, analyticsEventConstants) {
  'use strict';

  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Angulartics mutates input parameters which causes events to bleed into each other, resulting in erroneous tracking.
  var eventCategory = function() {
    return {category: 'Provenance'};
  };

  var emailAddress = getParameterByName('emailed_to');
  if (emailAddress.length > 0) {
    analytics.setUserProperties({
      'last opened email from': emailAddress
    });

    $rootScope.$emit(identifiedUserNotifierConstants.eventName, { email: emailAddress });
  }

  var utmCampaign = getParameterByName('utm_campaign');
  var utmSource = getParameterByName('utm_source');
  var utmMedium = getParameterByName('utm_medium');
  var utmContent = getParameterByName('utm_content');

  if (utmCampaign.length > 0 || utmSource.length > 0 || utmMedium.length > 0 || utmContent.length > 0) {
    analytics.eventTrack('Arrived from campaign "' +
      utmCampaign + '/' +
      utmSource + '/' +
      utmMedium + '/' +
      utmContent + '"',
      eventCategory());
  }

  analytics.eventTrack(
    analyticsEventConstants.abstract.titleSiteVisited,
    analyticsEventConstants.abstract.category);
});

