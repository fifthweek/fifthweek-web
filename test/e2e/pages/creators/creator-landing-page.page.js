'use strict';

var CreatorLandingPagePage = function() {};

CreatorLandingPagePage.prototype = Object.create({}, {
  fifthweekLink: { get: function() { return element(by.css('.fifthweek-logo-sm a')); }},
  editPageLink: { get: function() { return element(by.id('edit-page-link')); }},
  subscribeButton: { get: function() { return element(by.id('subscribe-button')); }},
  unsubscribeButton: { get: function() { return element(by.id('subscribed-button')); }},
  moreInfo: { get: function () { return element(by.id('more-info')); }},
  video: { get: function () { return element(by.css('#video iframe')); }},
  fullDescription: { get: function () { return element(by.id('full-description')); }},
  getChannel: { value: function (index) { return element(by.id('channel-' + index)); }},
  getChannelPrice: { value: function (index) { return element(by.id('channel-price-' + index)); }},
  channelCount: { get: function () { return element.all(by.css('.channels .channel')).count(); }},
  channelListTotalPrice: { get: function() { return element(by.css('.subscribe-now-total')); }},
  channelListSubscribeLink: { get: function() { return element(by.id('subscribe-link')); }}
});

module.exports = CreatorLandingPagePage;
