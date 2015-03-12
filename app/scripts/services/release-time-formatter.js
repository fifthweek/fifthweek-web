angular.module('webApp').factory('releaseTimeFormatter', function() {
  'use strict';

  var service = {};
  var daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  service.getDayOfWeek = function(hourOfWeek) {
    if (!_.isNumber(hourOfWeek)) {
      throw new FifthweekError('Hour of week must be a number');
    }
    if (hourOfWeek < 0 || hourOfWeek > 167) {
      throw new FifthweekError('Hour of week must be between 0 and 167');
    }

    return daysOfWeek[Math.floor(hourOfWeek / 24)];
  };

  service.getDaysOfWeek = function(hoursOfWeek) {
    return _.map(hoursOfWeek, service.getDayOfWeek);
  };

  service.getTimeOfWeek = function(hourOfWeek) {
    return (hourOfWeek % 24) + ':00';
  };

  service.getDayAndTimeOfWeek = function(hourOfWeek) {
    return {
      day: service.getDayOfWeek(hourOfWeek),
      time: service.getTimeOfWeek(hourOfWeek)
    };
  };

  service.getDayAndTimesOfWeek = function(hoursOfWeek) {
    return _.map(hoursOfWeek, service.getDayAndTimeOfWeek);
  };

  return service;
});
