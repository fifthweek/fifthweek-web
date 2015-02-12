var TestKit = require('../../test-kit.js');
var RegisterPage = require('../../pages/register.page.js');
var SignOutPage = require('../../pages/sign-out.page.js');
var CreateSubscriptionPage = require('../../pages/creators/create-subscription.page.js');

describe('create subscription page', function() {
  'use strict';

  var username;

  var testKit = new TestKit();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var page = new CreateSubscriptionPage();

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
    var credentials = registerPage.registerSuccessfully();
    username = credentials.username;
  });

});
