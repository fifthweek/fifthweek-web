'use strict';

var ChannelAddPage = function() {};

ChannelAddPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/customize/channels/new'; }}
});

module.exports = ChannelAddPage;
