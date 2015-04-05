'use strict';

var HeaderPage = require('./header.page.js');
var HeaderBacklogPage = function() {};

HeaderBacklogPage.prototype = Object.create(HeaderPage.prototype, {
  futurePostsLink: { get: function () { return element(by.id('header-navigation-future-posts')); }},
  queuesLink: { get: function () { return element(by.id('header-navigation-queues')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Future Posts',
        element: this.futurePostsLink
      },
      {
        name: 'Queues',
        element: this.queuesLink
      }
    ]);
  }}
});

module.exports = HeaderBacklogPage;
