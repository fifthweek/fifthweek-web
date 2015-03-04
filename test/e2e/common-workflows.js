'use strict';

var HomePage = require('./pages/home.page.js');
var SignInPage = require('./pages/sign-in.page.js');
var CreateSubscriptionPage = require('./pages/creators/create-subscription.page.js');
var RegisterPage = require('./pages/register.page.js');
var SignOutPage = require('./pages/sign-out.page.js');

var CommonWorkflows = function() {};

CommonWorkflows.prototype = Object.create({}, {
  createSubscription: { value: function() {
    new SignOutPage().signOutAndGoHome();
    var registration = new RegisterPage().registerSuccessfully();
    var subscription = new CreateSubscriptionPage().submitSuccessfully();

    return {
      registration: registration,
      subscription: subscription
    };
  }},

  reSignIn: { value: function(registration) {
    new SignOutPage().signOutAndGoHome();
    new HomePage().signInLink.click();
    new SignInPage().signInSuccessfully(registration.username, registration.password);
  }}
});

module.exports = CommonWorkflows;
