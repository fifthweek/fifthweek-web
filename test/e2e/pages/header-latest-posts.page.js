'use strict';

var HeaderPage = require('./header.page.js');
var HeaderLatestPostsPage = function() {};

HeaderLatestPostsPage.prototype = Object.create(HeaderPage.prototype, {
  latestPostsLink: { get: function () { return element(by.id('header-navigation-latest-posts')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Latest Posts',
        element: this.latestPostsLink
      }
    ]);
  }}
});

module.exports = HeaderLatestPostsPage;
