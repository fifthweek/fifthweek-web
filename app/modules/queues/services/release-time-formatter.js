angular.module('webApp').factory('releaseTimeFormatter', function() {
  'use strict';

  var service = {};
  var hoursInWeek = 7 * 24;
  var daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  var modulo = function(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
  };

  service.getDayOfWeek = function(hourOfWeek) {
    if (!_.isNumber(hourOfWeek)) {
      throw new FifthweekError('Hour of week must be a number');
    }
    if (hourOfWeek < 0 || hourOfWeek >= hoursInWeek) {
      throw new FifthweekError('Hour of week must be between 0 and ' + (hoursInWeek - 1));
    }

    return daysOfWeek[Math.floor(hourOfWeek / 24)];
  };

  service.getDaysOfWeek = function(hoursOfWeek) {
    return _.map(hoursOfWeek, service.getDayOfWeek);
  };

  service.getTimeOfWeek = function(hourOfWeek) {
    var result = (hourOfWeek % 24) + ':00';
    if (result.length === 4) {
      result = '0' + result;
    }

    return result;
  };

  service.getDayAndTimeOfWeek = function(hourOfWeek) {
    return {
      day: service.getDayOfWeek(hourOfWeek),
      time: service.getTimeOfWeek(hourOfWeek),
      hourOfWeek: hourOfWeek,
      sortKey: modulo(hourOfWeek - 24, hoursInWeek) // Start from Monday instead of Sunday.
    };
  };

  service.getDayAndTimesOfWeek = function(hoursOfWeek) {
    return _.map(hoursOfWeek, service.getDayAndTimeOfWeek);
  };

  return service;
});
