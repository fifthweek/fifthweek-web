'use strict';

var CreatorLandingPagePage = function() {};

CreatorLandingPagePage.prototype = Object.create({}, {
  fifthweekLink: { get: function() { return element(by.css('.fifthweek-logo-sm a')); }},
  subscribeButton: { get: function() { return element(by.id('subscribe-button')); }},
  moreInfo: { get: function () { return element(by.id('more-info')); }},
  video: { get: function () { return element(by.css('#video iframe')); }},
  fullDescription: { get: function () { return element(by.id('full-description')); }},
  getChannel: { value: function (index) { return element(by.id('channel-' + index)); }},
  channelCount: { get: function () { return element.all(by.css('.channels .channel')).count(); }}
});

module.exports = CreatorLandingPagePage;
