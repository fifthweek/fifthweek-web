angular.module('webApp').factory('analytics',
  function($analytics) {
    'use strict';

    var analytics = {};

    analytics.eventTrack = function(eventTitle, eventCategory) {
      $analytics.eventTrack(eventTitle, { category: eventCategory });
    };

    analytics.setUsername = function(userId) {
      $analytics.setUsername(userId);
    };

    return analytics;
  });
