'use strict';

var ChannelListPage = function() {};

ChannelListPage.prototype = Object.create({}, {
  addChannelButton: { get: function () { return element(by.id('add-button')); }}
});

module.exports = ChannelListPage;
