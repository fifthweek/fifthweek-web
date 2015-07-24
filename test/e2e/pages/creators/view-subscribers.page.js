(function(){
  'use strict';

  var TestKit = require('../../test-kit.js');
  var testKit = new TestKit();

  var viewSubscribersPage = function() {};

  viewSubscribersPage.prototype = Object.create({}, {

    pageUrl: { get: function () { return '/creator/subscribers/all'; }},

    totalRevenue: { get: function(){ return element(by.id('total-revenue')); }},
    estimatedWeeklyRevenue: { get: function(){ return element(by.id('estimated-weekly-revenue')); }},
    totalSubscriptions: { get: function(){ return element(by.id('total-subscriptions')); }},
    totalSubscribers: { get: function(){ return element(by.id('total-subscribers')); }},
    totalUnacceptablePrices: { get: function(){ return element(by.id('total-unacceptable-prices')); }},
    totalUnacceptablePricesCount: { get: function(){ return element.all(by.id('total-unacceptable-prices')).count(); }},

    acceptedIndicatorCount: { get: function () { return element.all(by.css('.price-accepted-indicator')).count(); }},
    notAcceptedIndicatorCount: { get: function () { return element.all(by.css('.price-not-accepted-indicator')).count(); }},
    guestListIndicatorCount: { get: function () { return element.all(by.css('.guest-list-indicator')).count(); }},

    subscriberCount: { get: function () { return element.all(by.css('.subscriber-row')).count(); }}
  });

  module.exports = viewSubscribersPage;
})();
