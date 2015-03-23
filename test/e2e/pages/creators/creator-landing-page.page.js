'use strict';

var CreatorLandingPagePage = function() {};

CreatorLandingPagePage.prototype = Object.create({}, {
  fifthweekLink: { get: function() { return element(by.css('.fifthweek-logo-sm a')); }},
  subscribeButton: { get: function() { return element(by.id('subscribe-button')); }},
  moreInfo: { get: function () { return element(by.id('more-info')); }},
  video: { get: function () { return element(by.id('video')); }},
  fullDescription: { get: function () { return element(by.id('full-description')); }},
  pageUrl: { get: function () { return '/creators/landing-page'; }}
});

module.exports = CreatorLandingPagePage;
