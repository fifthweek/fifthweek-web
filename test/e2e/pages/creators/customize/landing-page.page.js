'use strict';

var CustomizeLandingPagePage = function() {};

CustomizeLandingPagePage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/customize/landingpage'; }}
});

module.exports = CustomizeLandingPagePage;
