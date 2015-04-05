'use strict';

var ContactUsPage = function() {};

ContactUsPage.prototype = Object.create({}, {
  mailtoLink: { get: function () { return element(by.id('mailto-link')); }}
});

module.exports = ContactUsPage;
