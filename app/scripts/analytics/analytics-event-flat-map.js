angular.module('webApp').factory('analyticsEventFlatMap',
  function() {
    'use strict';

    return function(eventTitle, eventCategory) {
      var events = [ {
        eventTitle: eventTitle,
        eventCategory: eventCategory
      }];

      // Allows us to track all 'interest registrations' as a single aggregate conversion in GA.
      if (eventCategory === 'Interest Registration') {
        events.push({
          eventTitle: 'All',
          eventCategory: 'Interest Registration'
        });
      }

      return events;
    };
  });
