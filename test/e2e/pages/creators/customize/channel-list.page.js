'use strict';

var ChannelListPage = function() {};

ChannelListPage.prototype = Object.create({}, {
  defaultChannelName: { value: 'Basic Subscription' },
  defaultChannelDescription: { value: 'Exclusive News Feed\nEarly Updates on New Releases' },
  addChannelButton: { get: function () { return element(by.id('add-button')); }},
  channels: { get: function () { return element.all(by.css('#channels .item')); }},
  getChannel: { value: function(index) {
    return element(by.css('#channels .item:nth-child(' + (index + 1) + ')'))
  }},
  getEditChannelButton: { value: function(index) {
    return element(by.css('#channels .item:nth-child(' + (index + 1) + ') button'))
  }},
  expectChannel: { value: function(channelIndex, channelData) {
    var element = this.getChannel(channelIndex);
    expect(element.getText()).toContain(channelData.name);
    expect(element.getText()).toContain('$' + channelData.price);
    expect(element.getText()).toContain(channelData.description);
  }},
  waitForPage: { value: function() {
    var self = this;
    browser.wait(function(){
      return self.addChannelButton.isPresent();
    });
  }}
});

module.exports = ChannelListPage;
