'use strict';

var HeaderPage = require('./header.page.js');
var HeaderScheduledPostsPage = function() {};

HeaderScheduledPostsPage.prototype = Object.create(HeaderPage.prototype, {
  scheduledPostsLink: { get: function () { return element(by.id('header-navigation-scheduled-posts')); }},
  queuesLink: { get: function () { return element(by.id('header-navigation-queues')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Scheduled Posts',
        element: this.scheduledPostsLink
      },
      {
        name: 'Queues',
        element: this.queuesLink
      }
    ]);
  }}
});

module.exports = HeaderScheduledPostsPage;
