'use strict';

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
    browser.waitForAngular();
    browser.controlFlow().execute(function() {
      var script =
        'angular.element(document.body).injector().get(\'$state\').go(\'home\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
      return browser.executeScript(script);
    });
    return browser.waitForAngular();
  }}
});

module.exports = SignOutPage;
