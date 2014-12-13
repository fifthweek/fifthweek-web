'use strict';

var DemonstrationPage = function() {};

DemonstrationPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/dashboard'; }},
  title: { get: function () { return 'Quick demo'; }},
  video: { get: function () { return element(by.css('.embed-responsive iframe')); }},
  videoUrl: { get: function () { return '//player.vimeo.com/video/114268258'; }}
});

module.exports = DemonstrationPage;
