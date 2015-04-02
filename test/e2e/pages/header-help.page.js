'use strict';

var HeaderHelpPage = function() {};

HeaderHelpPage.prototype = Object.create({}, {
  faqLink: { get: function () { return element(by.id('header-navigation-faq')); }},
  contactLink: { get: function () { return element(by.id('header-navigation-contact-us')); }}
});

module.exports = HeaderHelpPage;
