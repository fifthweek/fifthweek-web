'use strict';

var HomePage = function() {};

HomePage.prototype = Object.create({}, {
  signInLink: { get: function () { return element(by.id('sidebar-navigation-sign-in')); }},
  getStartedLink: { get: function(){ return element(by.id('get-started'))}},
  getStartedBottomLink: { get: function(){ return element(by.id('get-started-bottom'))}},
  introHeading: { get: function () { return element(by.id('intro-heading')); }},
  introSubHeading: { get: function () { return element(by.id('intro-sub-heading')); }},
  playVideoLink: { get: function () { return element(by.id('play-video-link')); }},
  videoIFrame: { get: function () { return element(by.id('home-modal-video')); }},
  videoIFrameCloseButton: { get: function () { return element(by.id('modal-cross-button')); }}
});

module.exports = HomePage;
