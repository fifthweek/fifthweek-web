'use strict';

var NavigationHelpPage = function() {};

NavigationHelpPage.prototype = Object.create({}, {
  faqButton: { get: function () { return element(by.id('navigation-faq')); }},
  contactButton: { get: function () { return element(by.id('navigation-contact-us')); }}
});

module.exports = NavigationHelpPage;
