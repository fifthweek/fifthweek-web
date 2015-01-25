'use strict';

var FeedbackPage = function() {};

FeedbackPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/dashboard/feedback'; }},
  title: { get: function () { return 'Provide Feedback'; }},
  mailtoLink: { get: function () { return element(by.id('mailtoLink')); }}
});

module.exports = FeedbackPage;
