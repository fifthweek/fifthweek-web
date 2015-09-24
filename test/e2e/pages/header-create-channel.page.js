'use strict';

var HeaderPage = require('./header.page.js');
var HeaderCreateChannelPage = function() {};

HeaderCreateChannelPage.prototype = Object.create(HeaderPage.prototype, {
  createChannelLink: { get: function () { return element(by.id('header-navigation-create-channel')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Create Channel',
        element: this.createChannelLink
      }
    ]);
  }}
});

module.exports = HeaderCreateChannelPage;
