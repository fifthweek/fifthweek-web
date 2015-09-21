(function(){
  'use strict';

  var PostListInformationPage = function() {};

  PostListInformationPage.prototype = Object.create({}, {
    postsHeader: { get: function() { return element(by.css('.posts-header')); }},
    postsGuestListInformation: { get: function() { return element(by.css('.guest-list-information')); }},
    priceChangeIndicatorCount: { get: function() { return element.all(by.css('.price-row')).count(); }},
    getPriceChangeIndicator: { value: function(index) {
      return element(by.id('updated-price-' + index));
    }},
    getAcceptButton: { value: function(index) {
      var indicator = this.getPriceChangeIndicator(index);
      return indicator.element(by.css('.btn-success'));
    }},
    getManageButton: { value: function(index) {
      var indicator = this.getPriceChangeIndicator(index);
      return indicator.element(by.css('.btn-default'));
    }},
    expectPriceChange: { value: function(index, from, to) {
      var indicator = this.getPriceChangeIndicator(index);
      var prices = indicator.all(by.css('.price'));
      expect(prices.get(0).getText()).toBe('$' + Number(from).toFixed(2) + '/week');
      expect(prices.get(1).getText()).toBe('$' + Number(to).toFixed(2) + '/week');
    }},
    expectPriceChangeType: { value: function(index, type) {
      var indicator = this.getPriceChangeIndicator(index);
      var count = indicator.all(by.css(type)).count();
      expect(count).toBe(1);
    }},
    expectChannelPriceIncrease: { value: function(index, from, to) {
      this.expectPriceChangeType(index, '.channel-price-increase');
      this.expectPriceChange(index, from, to);
    }},
    expectChannelPriceDecrease: { value: function(index, from, to) {
      this.expectPriceChangeType(index, '.channel-price-decrease');
      this.expectPriceChange(index, from, to);
    }}
  });

  module.exports = PostListInformationPage;
})();
