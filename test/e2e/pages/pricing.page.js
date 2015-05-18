'use strict';

var PricingPage = function() {};

PricingPage.prototype = Object.create({}, {
  letUsTalkLink: { get: function(){ return element(by.id('let-us-talk'))}}
});

module.exports = PricingPage;
