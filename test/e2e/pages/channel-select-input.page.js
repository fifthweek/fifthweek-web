'use strict';

var _ = require('lodash');
var TestKit = require('../test-kit.js');
var ChannelListPage = require('./creators/customize/channel-list.page.js');
var testKit = new TestKit();
var channelListPage = new ChannelListPage();

var defaultChannelSelectText = 'Share with everyone';

var ChannelSelectInputPage = function() {};

ChannelSelectInputPage.prototype = Object.create({},
{
  channelNameMap: { value: {} },
  mapToSelectTexts: { value: function(channelNames) {
    var self = this;
    return _.map(channelNames, function(channelName) {
      return self.mapToSelectText(channelName);
    });
  }},
  mapToSelectText: { value: function(channelName) {
    this.channelNameMap[channelName] = channelName === channelListPage.defaultChannelName ? defaultChannelSelectText : '"' + channelName + '" Only';
    return this.channelNameMap[channelName];
  }},
  mapToChannelName: { value: function(channelSelectText) {
    return _.findKey(this.channelNameMap, channelSelectText);
  }},
  isDefaultChannel: { value: function(channelName) {
    return channelName === channelListPage.defaultChannelName;
  }}
});

module.exports = ChannelSelectInputPage;
