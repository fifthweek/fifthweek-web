'use strict';

var CreatorTimelinePage = function() {};

CreatorTimelinePage.prototype = Object.create({}, {
  subscribedButton: { get: function() { return element(by.id('subscribed-button')); }}
});

module.exports = CreatorTimelinePage;
