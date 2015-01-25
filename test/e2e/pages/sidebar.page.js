'use strict';

var DemonstrationPage = require('./demonstration.page.js');
var FeedbackPage = require('./feedback.page.js');

var SidebarPage = function() {};

SidebarPage.prototype = Object.create({}, {
  links: { get: function () { return element.all(by.css('#sidebar a')); }},
  feedbackLink: { get: function () { return element(by.id('feedbackLink')); }},
  sidebarRegisterButton: { get: function () { return element(by.id('registerButton')); }},
  linkedPages: { get: function () { return [new DemonstrationPage(), new FeedbackPage()]; }}
});

module.exports = SidebarPage;
