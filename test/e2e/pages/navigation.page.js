'use strict';

var NavigationPage = function() {};

NavigationPage.prototype = Object.create({}, {
  registerButton: { get: function () { return element(by.id('navigation-register')); }},
  helpButton: { get: function () { return element(by.id('navigation-help')); }}
});

module.exports = NavigationPage;
