'use strict';

var HeaderInformationPage = function() {};

HeaderInformationPage.prototype = Object.create({}, {
  createFreeAccountLink: { get: function(){ return element(by.id('create-free-account-link'))}},
  featuresLink: { get: function(){ return element(by.id('features-link'))}},
  pricingLink: { get: function(){ return element(by.id('pricing-link'))}}
});

module.exports = HeaderInformationPage;
