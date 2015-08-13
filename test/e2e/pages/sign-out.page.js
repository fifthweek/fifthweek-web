'use strict';

var SignOutPage = function() {};

SignOutPage.prototype = Object.create({},
{
  signOutAndGoHome: { value: function() {
    browser.controlFlow().execute(function() {
      var script =
        'angular.element(document.body).injector().get(\'$state\').go(\'user.signOut\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ' +
        'angular.element(document.body).injector().get(\'$state\').go(\'home\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
      return browser.executeScript(script);
    });
  }}
});

module.exports = SignOutPage;
