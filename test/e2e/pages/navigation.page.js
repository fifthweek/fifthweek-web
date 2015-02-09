'use strict';

var DemonstrationPage = require('./demonstration.page.js');
var FeedbackPage = require('./feedback.page.js');

var NavigationPage = function() {};

NavigationPage.prototype = Object.create({}, {
  links: { get: function () { return element.all(by.css('#sidebar a')); }},
  feedbackLink: { get: function () { return element(by.id('navigation-provide-feedback')); }},
  sidebarRegisterButton: { get: function () { return element(by.id('navigation-register')); }},
  linkedPages: { get: function () { return [new DemonstrationPage(), new FeedbackPage()]; }}
});

module.exports = NavigationPage;
