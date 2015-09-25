angular.module('webApp').factory('analytics',
  function($q, $analytics, logService) {
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

    var eventTrackInternal = function(eventData) {
      return safeAsyncExecute(function() {
        return $analytics.eventTrack(eventData.eventTitle, { category: eventData.eventCategory });
      });
    };

    analytics.eventTrack = function(eventTitle, eventCategory) {
      try{
        return eventTrackInternal({
          eventCategory: eventCategory,
          eventTitle: eventTitle
        });
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
