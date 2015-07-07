angular.module('webApp').factory('analytics',
  function($q, $analytics, analyticsEventFlatMap, logService) {
    'use strict';

    var analytics = {};

    var safeAsyncExecute = function(work) {
      try{
        return $q.when(work())
          .catch(function(error){
            logService.error(error);
          });
      }
      catch(error){
        logService.error(error);
        return $q.when();
      }
    };

    var eventTrackTwitter = function(eventData) {
      return safeAsyncExecute(function() {
        return window.twttr.conversion.trackPid(eventData.eventTitle, { tw_sale_amount: 0, tw_order_quantity: 0 });
      });
    };

    var eventTrackNonTwitter = function(eventData) {
      return safeAsyncExecute(function() {
        return $analytics.eventTrack(eventData.eventTitle, { category: eventData.eventCategory });
      });
    };

    analytics.eventTrack = function(eventTitle, eventCategory) {
      try{
        var expandedEvents = analyticsEventFlatMap(eventTitle, eventCategory);
        var promises = _.map(expandedEvents, function(eventData) {
          if (eventData.forTwitter) {
            return eventTrackTwitter(eventData);
          }
          else {
            return eventTrackNonTwitter(eventData);
          }
        });

        return $q.all(promises);
      }
      catch(error){
        logService.error(error);
        return $q.when();
      }
    };

    analytics.setUsername = function(userId) {
      return safeAsyncExecute(function() {
        return $analytics.setUsername(userId);
      });
    };

    analytics.setUserProperties = function(properties) {
      return safeAsyncExecute(function() {
        return $analytics.setUserProperties(properties);
      });
    };

    return analytics;
  });
