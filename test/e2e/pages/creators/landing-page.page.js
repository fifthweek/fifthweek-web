'use strict';

var LandingPagePage = function() {};

LandingPagePage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/landing-page'; }}
});

module.exports = LandingPagePage;
