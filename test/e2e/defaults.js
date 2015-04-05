'use strict';

var Defaults = function() {};

Defaults.prototype = Object.create({}, {
  channelName: { value: 'Basic Subscription' },
  channelDescription: { value: 'Exclusive News Feed\nEarly Updates on New Releases' },
  introduction: { value: 'Welcome to my new exclusive series. More of your favourites released every week, available to subscribers only.' }
});

module.exports = Defaults;
