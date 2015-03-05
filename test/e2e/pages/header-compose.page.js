'use strict';

var HeaderPage = require('./header.page.js');
var HeaderComposePage = function() {};

HeaderComposePage.prototype = Object.create(HeaderPage.prototype, {
  noteLink: { get: function () { return element(by.id('navigation-write-a-note')); }},
  imageLink: { get: function () { return element(by.id('navigation-share-image')); }},
  fileLink: { get: function () { return element(by.id('navigation-share-file')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Write A Note',
        element: this.noteLink
      },
      {
        name: 'Share Image',
        element: this.imageLink
      },
      {
        name: 'Share File',
        element: this.fileLink
      }
    ]);
  }}
});

module.exports = HeaderComposePage;
