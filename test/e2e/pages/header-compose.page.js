'use strict';

var HeaderPage = require('./header.page.js');
var HeaderComposePage = function() {};

HeaderComposePage.prototype = Object.create(HeaderPage.prototype, {
  noteLink: { get: function () { return element(by.id('navigation-write-a-note')); }},
  imageLink: { get: function () { return element(by.id('navigation-upload-image')); }},
  fileLink: { get: function () { return element(by.id('navigation-upload-file')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Write A Note',
        element: this.noteLink
      },
      {
        name: 'Upload Image',
        element: this.imageLink
      },
      {
        name: 'Upload File',
        element: this.fileLink
      }
    ]);
  }}
});

module.exports = HeaderComposePage;
