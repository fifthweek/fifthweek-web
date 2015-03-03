'use strict';

var HeaderPage = function() {};

HeaderPage.prototype = Object.create({}, {
  title: { get: function () { return element(by.id('header-title')); }},
  navigationList: { get: function () { return element(by.id('header-navbar')); }},
  navigationLinks: { get: function () { return element.all(by.css('#header-navbar a')); }}
});

module.exports = HeaderPage;
