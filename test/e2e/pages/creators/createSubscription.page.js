'use strict';

var CreateSubscriptionPage = function() {};

CreateSubscriptionPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/create-subscription'; }}
});

module.exports = CreateSubscriptionPage;
