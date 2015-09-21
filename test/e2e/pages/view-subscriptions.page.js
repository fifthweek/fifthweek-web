(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();

  var viewSubscriptionsPage = function() {};

  var createBlogSelector = function(blogIndex){
    return '#blog-panel-' + blogIndex;
  };

  viewSubscriptionsPage.prototype = Object.create({}, {

    byCss: { value: function(blogIndex, css){
      return by.css(createBlogSelector(blogIndex) + ' ' + css);
    }},

    accountBalanceAmount: { get: function(){ return element(by.id('account-balance')); }},
    subscriptionsCost: { get: function(){ return element(by.id('subscriptions-cost')); }},
    changedPricesCost: { get: function(){ return element(by.id('changed-prices-cost')); }},
    changedPricesCostCount: { get: function(){ return element.all(by.id('changed-prices-cost')).count(); }},

    firstBlogLink: { get: function(){ return element(by.css('#blog-panel-0 .blog-link')); }},
    firstChannelLink: { get: function(){ return element(by.css('#blog-panel-0 #channel-list-row-0 .channel-link')); }},

    manageButton: { value: function(blogIndex) {
      return element(this.byCss(blogIndex, '.manage-button'));
    }},

    blogCount: { get: function(){ return element.all(by.css('.blog-panel')).count(); }},
    channelCount: { get: function(){ return element.all(by.css('.channel-list-row')).count(); }},

    expectZeroAccountBalance: { value: function() {
      expect(this.accountBalanceAmount.getText()).toBe('$0.00');
    }},
    expectNonZeroAccountBalance: { value: function() {
      expect(this.accountBalanceAmount.getText()).not.toBe('$0.00');
    }},
    expectZeroSubscriptionsCost: { value: function() {
      expect(this.subscriptionsCost.getText()).toBe('$0.00/week');
    }},
    expectNonZeroSubscriptionsCost: { value: function() {
      expect(this.subscriptionsCost.getText()).not.toBe('$0.00/week');
    }},
    expectNoChangedPricesCost: { value: function() {
      expect(this.changedPricesCostCount).toBe(0);
    }},
    expectZeroChangedPricesCost: { value: function() {
      expect(this.changedPricesCost.getText()).toBe('$0.00/week');
    }},
    expectNonZeroChangedPricesCost: { value: function() {
      expect(this.changedPricesCost.getText()).not.toBe('$0.00/week');
    }}
  });

  module.exports = viewSubscriptionsPage;
})();
