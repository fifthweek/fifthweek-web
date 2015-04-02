'use strict';

var HeaderPage = require('./header.page.js');
var HeaderPostsPage = function() {};

HeaderPostsPage.prototype = Object.create(HeaderPage.prototype, {
  liveNowLink: { get: function () { return element(by.id('navigation-live-now')); }},
  scheduledLink: { get: function () { return element(by.id('navigation-scheduled')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Live Now',
        element: this.collectionsLink
      },
      {
        name: 'Scheduled',
        element: this.scheduledLink
      }
    ]);
  }}
});

module.exports = HeaderPostsPage;
