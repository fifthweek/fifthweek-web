'use strict';

var HeaderPage = require('./header.page.js');
var HeaderLandingPagePage = function() {};

HeaderLandingPagePage.prototype = Object.create(HeaderPage.prototype, {
  previewLink: { get: function () { return element(by.id('header-navigation-preview')); }},
  editPageLink: { get: function () { return element(by.id('header-navigation-edit-page')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Preview',
        element: this.previewLink
      },
      {
        name: 'Edit Page',
        element: this.editPageLink
      }
    ]);
  }}
});

module.exports = HeaderLandingPagePage;
