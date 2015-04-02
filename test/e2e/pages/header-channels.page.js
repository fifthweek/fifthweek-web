'use strict';

var HeaderPage = require('./header.page.js');
var HeaderChannelsPage = function() {};

HeaderChannelsPage.prototype = Object.create(HeaderPage.prototype, {
  channelsLink: { get: function () { return element(by.id('header-navigation-channels')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Channels',
        element: this.channelsLink
      }
    ]);
  }}
});

module.exports = HeaderChannelsPage;
