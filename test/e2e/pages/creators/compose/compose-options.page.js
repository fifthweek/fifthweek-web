'use strict';

var ComposeOptionsPage = function() {};

ComposeOptionsPage.prototype = Object.create({}, {
  postLink: { get: function() { return element(by.id('compose-post-link')); }}
});

module.exports = ComposeOptionsPage;
