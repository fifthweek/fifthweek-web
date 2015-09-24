'use strict';

var HeaderPage = require('./header.page.js');
var HeaderLivePostsPage = function() {};

HeaderLivePostsPage.prototype = Object.create(HeaderPage.prototype, {
  livePostsLink: { get: function () { return element(by.id('header-navigation-live-posts')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Live Posts',
        element: this.livePostsLink
      }
    ]);
  }}
});

module.exports = HeaderLivePostsPage;
