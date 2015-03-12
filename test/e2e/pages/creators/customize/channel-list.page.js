'use strict';

var ChannelListPage = function() {};

ChannelListPage.prototype = Object.create({}, {
  defaultChannelName: { value: 'Basic Subscription' },
  defaultChannelDescription: { value: 'Exclusive News Feed\nEarly Updates on New Releases' },
  addChannelButton: { get: function () { return element(by.id('add-button')); }},
  channels: { get: function () { return element.all(by.css('#channels .item')); }},
  getChannel: { value: function(name) {
    return element
      .all(by.css('#channels .item'))
      .filter(function(elem) {
        return elem.element(by.css('h5 a')).getText().then(function(text) {
          return text === name;
        });
      })
      .first();
  }},
  getEditChannelButton: { value: function(name) {
    return this.getChannel(name).element(by.tagName('button'));
  }},
  expectChannel: { value: function(channelData) {
    var element = this.getChannel(channelData.name);
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
