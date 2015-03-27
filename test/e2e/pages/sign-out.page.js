'use strict';

var SignOutPage = function() {};

SignOutPage.prototype = Object.create({},
{
  signOutAndGoHome: { value: function() {
    browser.controlFlow().execute(function() {
      browser.executeScript('angular.element(document.body).injector().get(\'$state\').go(\'signOut\')');
      browser.executeScript('angular.element(document.body).injector().get(\'$state\').go(\'home\')');
    });
  }}
});

module.exports = SignOutPage;
