'use strict';

var HomePage = function() {};

HomePage.prototype = Object.create({}, {
  signInLink: { get: function () { return element(by.id('sign-in-link')); }},
  playVideoLink: { get: function () { return element(by.id('play-video-link')); }},
  videoIFrame: { get: function () { return element(by.id('home-modal-video')); }}
});

module.exports = HomePage;
