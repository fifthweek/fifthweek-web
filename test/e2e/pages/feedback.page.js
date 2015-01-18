'use strict';

var FeedbackPage = function() {};

FeedbackPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/dashboard/feedback'; }},
  title: { get: function () { return 'Provide Feedback'; }},
  emailLink: { get: function () { return element(by.linkText('hello@fifthweek.com')); }}
});

module.exports = FeedbackPage;
