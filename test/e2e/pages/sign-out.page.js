'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();
var SignInPage = require('./sign-in.page.js');
var signInPage = new SignInPage();
var HomePage = require('./home.page.js');
var SidebarPage = require('./sidebar.page.js');
var sidebarPage = new SidebarPage();
var homePage = new HomePage();

var SignOutPage = function() {};

SignOutPage.prototype = Object.create({},
{
  signOutAndGoHome: { value: function() {
    browser.waitForAngular();
    browser.controlFlow().execute(function() {
      var script =
        'angular.element(document.body).injector().get(\'$state\').go(\'user.signOut\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
      return browser.executeScript(script);
    });
    testKit.waitForElementToDisplay(signInPage.signInButton);

    sidebarPage.fifthweekLogoLink.click();

    testKit.waitForElementToDisplay(homePage.getStartedLink);
    return browser.waitForAngular();
  }}
});

module.exports = SignOutPage;
