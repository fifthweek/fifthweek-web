'use strict';

var HeaderHelpPage = function() {};

HeaderHelpPage.prototype = Object.create({}, {
  faqLink: { get: function () { return element(by.id('navigation-faq')); }},
  contactLink: { get: function () { return element(by.id('navigation-contact-us')); }}
});

module.exports = HeaderHelpPage;
