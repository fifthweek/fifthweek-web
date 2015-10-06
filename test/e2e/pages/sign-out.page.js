'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();
var SignInPage = require('./sign-in.page.js');
var signInPage = new SignInPage();
var HomePage = require('./home.page.js');
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
    browser.controlFlow().execute(function() {
      var script =
        'angular.element(document.body).injector().get(\'$state\').go(\'home\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
      return browser.executeScript(script);
    });

    testKit.waitForElementToDisplay(homePage.signInLink);
    return browser.waitForAngular();
  }}
});

module.exports = SignOutPage;
