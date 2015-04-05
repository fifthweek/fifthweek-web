'use strict';

var path = require('path');

var ModalPage = function() {};

ModalPage.prototype = Object.create({}, {
  title: { get: function () { return element(by.id('modal-title')); }},
  modalCount: { get: function () { return element.all(by.css('.modal')).count(); }},
  getCrossButton: { value: function (idPrefix) { return element(by.id(idPrefix + '-cross-button')); }},
  crossButton: { get: function () { return this.getCrossButton('modal'); }},

  // Note: not all modals have these:
  getCancelButton: { value: function (idPrefix) { return element(by.id(idPrefix + '-cancel-button')); }},
  cancelButton: { get: function () { return this.getCancelButton('modal'); }}
});

module.exports = ModalPage;
