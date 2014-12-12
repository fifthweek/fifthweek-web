'use strict';

var HeaderPage = function() {};

HeaderPage.prototype = {
  get registerLink() { return element(by.id('registerLink')) },
  get signInLink() { return element(by.id('signInLink')) }
};

module.exports = HeaderPage;
