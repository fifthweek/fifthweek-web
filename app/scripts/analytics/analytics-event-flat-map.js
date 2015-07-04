angular.module('webApp').factory('analyticsEventFlatMap',
  function(analyticsEventConstants, analyticsTwitterConstants) {
    'use strict';

    var twitterEvent = function(conversionCode) {
      return {
        eventTitle: conversionCode,
        forTwitter: true
      };
    };

    var handleAbstractEvents = function(events, eventTitle) {
      if (eventTitle === analyticsEventConstants.abstract.titleSiteVisited) {
        events.push(
          twitterEvent(analyticsTwitterConstants.siteVisited)
        );
      }
    };

    var handleInterestRegistration = function(events, eventTitle) {
      var eventConstants = analyticsEventConstants.interestRegistration;

      // Allows us to track all 'interest registrations' as a single aggregate conversion.
      events.push(
        twitterEvent(analyticsTwitterConstants.interestRegisteredAny)
      );
      events.push({
        eventCategory: eventConstants.category,
        eventTitle: eventConstants.titleAny
      });

      if (eventTitle === eventConstants.titleFauxRegistered) {
        events.push(
          twitterEvent(analyticsTwitterConstants.fauxRegistered)
        );
      }

      if (eventTitle === eventConstants.titlePricingRequested) {
        events.push(
          twitterEvent(analyticsTwitterConstants.pricingRequested)
        );
      }
    };

    var handleRegistration = function(events, eventTitle) {
      if (eventTitle === analyticsEventConstants.registration.title) {
        events.push(
          twitterEvent(analyticsTwitterConstants.registered)
        );
      }
    };

    return function(eventTitle, eventCategory) {
      var events = [];

      if (eventCategory === analyticsEventConstants.abstract.category) {
        handleAbstractEvents(events, eventTitle);
      }
      else {
        events.push({
          eventCategory: eventCategory,
          eventTitle: eventTitle
        });

        if (eventCategory === analyticsEventConstants.interestRegistration.category) {
          handleInterestRegistration(events, eventTitle);
        }

        if (eventCategory === analyticsEventConstants.registration.category) {
          handleRegistration(events, eventTitle);
        }
      }

      return events;
    };
  });
