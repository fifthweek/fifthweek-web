'use strict';

var ComposeOptionsPage = function() {};

ComposeOptionsPage.prototype = Object.create({}, {
  imageLink: { get: function() { return element(by.id('post-image-link')); }},
  fileLink: { get: function() { return element(by.id('post-file-link')); }},
  noteLink: { get: function() { return element(by.id('post-note-link')); }}
});

module.exports = ComposeOptionsPage;
