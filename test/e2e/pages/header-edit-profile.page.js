'use strict';

var HeaderPage = require('./header.page.js');
var HeaderEditProfilePage = function() {};

HeaderEditProfilePage.prototype = Object.create(HeaderPage.prototype, {
  profileInformationLink: { get: function () { return element(by.id('header-navigation-profile-information')); }},
  channelsLink: { get: function () { return element(by.id('header-navigation-channels')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Profile Information',
        element: this.profileInformationLink
      },
      {
        name: 'Channels',
        element: this.channelsLink
      }
    ]);
  }}
});

module.exports = HeaderEditProfilePage;
