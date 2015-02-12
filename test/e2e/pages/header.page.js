'use strict';

var HeaderPage = function() {};

HeaderPage.prototype = Object.create({}, {
  title: { get: function () { return element(by.id('header-title')); }},
  navigationList: { get: function () { return element(by.id('header-navbar')); }}
});

module.exports = HeaderPage;
