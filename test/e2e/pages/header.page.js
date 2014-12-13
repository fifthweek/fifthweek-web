'use strict';

var HeaderPage = function() {};

HeaderPage.prototype = Object.create({}, {
  registerLink: { get: function () { return element(by.id('registerLink')); }},
  signInLink: { get: function () { return element(by.id('signInLink')); }}
});

module.exports = HeaderPage;
