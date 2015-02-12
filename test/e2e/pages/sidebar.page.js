'use strict';

var SidebarPage = function() {};

SidebarPage.prototype = Object.create({}, {
  links: { get: function () { return element.all(by.css('#sidebar ul a')); }},
  registerLink: { get: function () { return element(by.id('navigation-register')); }},
  helpLink: { get: function () { return element(by.id('navigation-help')); }}
});

module.exports = SidebarPage;
