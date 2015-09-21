'use strict';

var _ = require('lodash');
var TestKit = require('../../test-kit.js');
var QueueNameInputPage = require('../queue-name-input.page.js');

var testKit = new TestKit();
var queueNameInputPage = new QueueNameInputPage();

var QueueAddPage = function() {};

QueueAddPage.prototype = Object.create({}, {
  nameTextBoxId: { value: 'model-queue-name' },
  nameTextBox: { get: function() { return element(by.id(this.nameTextBoxId)); }},
  inputs: { value: function() { return [
    {
      name: 'nameTextBox',
      newValue: function() { return queueNameInputPage.newName(); }
    }
  ]; }},
  helpMessages: { get: function () { return element.all(by.css('#createQueueForm .help-block')); }},
  createButton: { get: function () { return element(by.id('create-queue-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  submitSuccessfully: { value: function() {
    testKit.waitForElementToDisplay(this.nameTextBox);
    var formValues = testKit.setFormValues(this, this.inputs());
    this.createButton.click();
    return {
      name: formValues.nameTextBox
    };
  }},
  submitQueueSuccessfully: { value: function(newQueueName) {
    testKit.waitForElementToDisplay(this.nameTextBox);
    testKit.setFormValues(this, this.inputs(), { nameTextBox: newQueueName });
    this.createButton.click();
    return {
      name: newQueueName
    };
  }}
});

module.exports = QueueAddPage;
