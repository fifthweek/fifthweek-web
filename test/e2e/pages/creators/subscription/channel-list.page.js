'use strict';

var TestKit = require('../../../test-kit.js');
var ChannelListPage = function() {};

var testKit = new TestKit();

ChannelListPage.prototype = Object.create({}, {
  addChannelButton: { get: function () { return element(by.id('add-button')); }},
  channels: { get: function () { return element.all(by.css('#channels .channel-name')); }},
  getChannel: { value: function(name) {
    return element
      .all(by.css('#channels .item'))
      .filter(function(elem) {
        return elem.element(by.css('.channel-name')).getText().then(function(text) {
          return text === name;
        });
      })
      .first();
  }},
  getEditChannelButton: { value: function(name) {
    return this.getChannel(name, true).element(by.tagName('button'));
  }},
  expectChannel: { value: function(channelData) {
    var element = this.getChannel(channelData.name);
    var channelName = element.element(by.css('.channel-name'));
    var channelDescription = element.element(by.css('.channel-description'));

    expect(channelName.getText()).toBe(channelData.name);
    expect(channelDescription.getText()).toContain(channelData.description);
  }},
  waitForPage: { value: function() {
    var self = this;
    testKit.waitForElementToDisplay(self.addChannelButton);
  }}
});

module.exports = ChannelListPage;
