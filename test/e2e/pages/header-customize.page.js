'use strict';

var HeaderPage = require('./header.page.js');
var HeaderCustomizePage = function() {};

HeaderCustomizePage.prototype = Object.create(HeaderPage.prototype, {
  landingPageLink: { get: function () { return element(by.id('navigation-your-landing-page')); }},
  channelsLink: { get: function () { return element(by.id('navigation-channels')); }},
  collectionsLink: { get: function () { return element(by.id('navigation-collections')); }}
});

module.exports = HeaderCustomizePage;
