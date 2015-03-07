angular.module('webApp').factory('releaseTimeFormatter', function() {
  'use strict';

  var service = {};

  service.getDaysOfWeek = function(hoursOfWeek) {
    return _.map(hoursOfWeek, function(hourOfWeek) {
      return [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ][Math.floor(hourOfWeek / 24)];
    })
  };

  return service;
});
