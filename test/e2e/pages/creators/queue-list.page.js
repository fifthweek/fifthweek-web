'use strict';

var TestKit = require('../../test-kit.js');

var testKit = new TestKit();

var QueueListPage = function() {};

QueueListPage.prototype = Object.create({}, {
  addQueueButton: { get: function () { return element(by.id('add-button')); }},
  queues: { get: function () { return element.all(by.css('#queues .queue-name')); }},
  getQueue: { value: function(name) {
    return element
      .all(by.css('#queues .item'))
      .filter(function(elem) {
        return elem.element(by.css('.queue-name')).getText().then(function(text) {
          return text === name;
        });
      })
      .first();
  }},
  getEditQueueButton: { value: function(name) {
    return this.getQueue(name, true).element(by.tagName('button'));
  }},
  expectQueue: { value: function(queueData) {
    var element = this.getQueue(queueData.name);
    var queueName = element.element(by.css('.queue-name'));

    expect(queueName.getText()).toBe(queueData.name);
  }},
  waitForPage: { value: function() {
    var self = this;
    testKit.waitForElementToDisplay(self.addQueueButton);
  }}
});

module.exports = QueueListPage;
