'use strict';

var HeaderPage = require('./header.page.js');

var HeaderSettingsPage = function() {};

HeaderSettingsPage.prototype = Object.create(HeaderPage.prototype, {
  accountSettingsLink: { get: function () { return element(by.id('navigation-account-settings')); }},
  signOutLink: { get: function () { return element(by.id('navigation-sign-out')); }},
  includeBasicTests: { value: function(highlightedLink) {
    var self = this;

    describe('header', function() {
      it('should contain the correct number of links', function() {
        expect(self.navigationLinks.count()).toBe(2);
      });

      it('should display account settings', function() {
        expect(self.accountSettingsLink.isDisplayed()).toBe(true);
      });

      it('should display sign out', function() {
        expect(self.signOutLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current page', function() {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }}
});

module.exports = HeaderSettingsPage;
