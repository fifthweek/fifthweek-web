angular.module('webApp').factory('analytics',
  function($q, $analytics, analyticsEventFlatMap, logService) {
    'use strict';

    var analytics = {};

    analytics.twitterTrack = function(conversionCode) {
      twttr.conversion.trackPid(conversionCode, { tw_sale_amount: 0, tw_order_quantity: 0 });
    };

    analytics.eventTrack = function(eventTitle, eventCategory) {
      var expandedEvents = analyticsEventFlatMap(eventTitle, eventCategory);
      var promises = _.map(expandedEvents, function(eventData) {
        try{
          return $q.when($analytics.eventTrack(eventData.eventTitle, { category: eventData.eventCategory }))
            .catch(function(error){
              logService.error(error);
            });
        }
        catch(error){
          logService.error(error);
          return $q.when();
        }
      });

      return $q.all(promises);
    };

    analytics.setUsername = function(userId) {
      try{
        return $q.when($analytics.setUsername(userId))
          .catch(function(error){
            logService.error(error);
          });
      }
      catch(error){
        logService.error(error);
        return $q.when();
      }
    };

    analytics.setUserProperties = function(properties) {
      try{
        return $q.when($analytics.setUserProperties(properties))
          .catch(function(error){
            logService.error(error);
          });
      }
      catch(error){
        logService.error(error);
        return $q.when();
      }
    };

    return analytics;
  });
