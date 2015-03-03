'use strict';

var SidebarPage = function() {};

SidebarPage.prototype = Object.create({}, {
  links: { get: function () { return element.all(by.css('#sidebar ul a')); }},
  signInLink: { get: function () { return element(by.id('navigation-sign-in')); }},
  registerLink: { get: function () { return element(by.id('navigation-register')); }},
  createSubscriptionLink: { get: function () { return element(by.id('navigation-create-subscription')); }},
  usernameLink: { get: function () { return element(by.id('navigation-username')); }},
  newPostLink: { get: function () { return element(by.id('navigation-new-post')); }},
  backlogLink: { get: function () { return element(by.id('navigation-backlog')); }},
  customizeLink: { get: function () { return element(by.id('navigation-customize')); }},
  settingsLink: { get: function () { return element(by.id('navigation-settings')); }},
  helpLink: { get: function () { return element(by.id('navigation-help')); }}
});

module.exports = SidebarPage;
