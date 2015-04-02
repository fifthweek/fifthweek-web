'use strict';

var path = require('path');

var ModalPage = function() {};

ModalPage.prototype = Object.create({}, {
  title: { get: function () { return element(by.id('modal-title')); }},
  modalCount: { get: function () { return element.all(by.css('.modal')).count(); }},
  crossButton: { get: function () { return element(by.id('modal-cross-button')); }},

  // Note: not all modals have these:
  cancelButton: { get: function () { return element(by.id('modal-cancel-button')); }}
});

module.exports = ModalPage;
