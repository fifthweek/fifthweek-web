'use strict';

var _ = require('lodash');
var Defaults = require('../defaults.js');
var TestKit = require('../test-kit.js');

var defaults = new Defaults();
var testKit = new TestKit();

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
    this.channelNameMap[channelName] = channelName === defaults.channelName ? defaultChannelSelectText : '"' + channelName + '" Only';
    return this.channelNameMap[channelName];
  }},
  mapToChannelName: { value: function(channelSelectText) {
    var channelName = _.findKey(this.channelNameMap, function(value) {
      return channelSelectText === value;
    });
    if (channelName === undefined) {
      throw 'No channel associated with selection "' + channelSelectText + '". Available selections are: ' + _.values(this.channelNameMap);
    }
    return channelName;
  }},
  isDefaultChannel: { value: function(channelName) {
    return channelName === defaults.channelName;
  }}
});

module.exports = ChannelSelectInputPage;
