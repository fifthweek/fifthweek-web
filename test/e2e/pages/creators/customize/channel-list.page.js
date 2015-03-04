'use strict';

var ChannelListPage = function() {};

ChannelListPage.prototype = Object.create({}, {
  addChannelButton: { get: function () { return element(by.id('add-button')); }},
  channels: { get: function () { return element.all(by.css('#channels .item')); }},
  getChannel: { value: function(index) {
    return element(by.css('#channels .item:nth-child(' + (index + 1) + ')'))
  }},
  getEditChannelButton: { value: function(index) {
    return element(by.css('#channels .item:nth-child(' + (index + 1) + ') button'))
  }}
});

module.exports = ChannelListPage;
