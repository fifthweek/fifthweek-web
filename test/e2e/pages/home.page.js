'use strict';

var HomePage = function() {};

HomePage.prototype = Object.create({}, {
  signInLink: { get: function () { return element(by.id('sign-in-link')); }},
  introHeading: { get: function () { return element(by.id('intro-heading')); }},
  introSubHeading: { get: function () { return element(by.id('intro-sub-heading')); }},
  playVideoLink: { get: function () { return element(by.id('play-video-link')); }},
  videoIFrame: { get: function () { return element(by.id('home-modal-video')); }},
  videoIFrameCloseButton: { get: function () { return element(by.id('modal-cross-button')); }}
});

module.exports = HomePage;
