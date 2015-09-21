'use strict';

var HeaderPage = require('./header.page.js');
var HeaderQueuesPage = function() {};

HeaderQueuesPage.prototype = Object.create(HeaderPage.prototype, {
  queuesLink: { get: function () { return element(by.id('header-navigation-queues')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Queues',
        element: this.queuesLink
      }
    ]);
  }}
});

module.exports = HeaderQueuesPage;
