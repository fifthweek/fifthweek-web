'use strict';

var HomePage = function() {};

HomePage.prototype = Object.create({}, {
  signInLink: { get: function () { return element(by.id('sign-in-link')); }}
});

module.exports = HomePage;
