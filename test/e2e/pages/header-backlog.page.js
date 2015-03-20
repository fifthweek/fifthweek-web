'use strict';

var HeaderPage = require('./header.page.js');
var HeaderBacklogPage = function() {};

HeaderBacklogPage.prototype = Object.create(HeaderPage.prototype, {
  yourFuturePostsLink: { get: function () { return element(by.id('navigation-your-future-posts')); }},
  queuesLink: { get: function () { return element(by.id('navigation-queues')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Your Future Posts',
        element: this.yourFuturePostsLink
      },
      {
        name: 'Queues',
        element: this.queuesLink
      }
    ]);
  }}
});

module.exports = HeaderBacklogPage;
