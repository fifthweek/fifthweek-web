'use strict';

var SidebarPage = function() {};

SidebarPage.prototype = Object.create({}, {
  links: { get: function () { return element.all(by.css('#sidebar ul a')); }},
  signInLink: { get: function () { return element(by.id('navigation-sign-in')); }},
  registerLink: { get: function () { return element(by.id('navigation-register')); }},
  createSubscriptionLink: { get: function () { return element(by.id('navigation-create-subscription')); }},
  usernameLink: { get: function () { return element(by.id('navigation-username')); }},
  newPostLink: { get: function () { return element(by.id('navigation-new-post')); }},
  backlogLink: { get: function () { return element(by.id('navigation-backlog')); }},
  customizeLink: { get: function () { return element(by.id('navigation-customize')); }},
  settingsLink: { get: function () { return element(by.id('navigation-settings')); }},
  helpLink: { get: function () { return element(by.id('navigation-help')); }},
  includeEstablishedCreatorTests: { value: function(highlightedLink) {
    var self = this;

    it('should contain the correct number of links', function () {
      expect(self.links.count()).toBe(6);
    });

    it('should contain "Username" link', function () {
      expect(self.usernameLink.isDisplayed()).toBe(true);
    });

    it('should contain "Settings" link', function () {
      expect(self.newPostLink.isDisplayed()).toBe(true);
    });

    it('should contain "Backlog" link', function () {
      expect(self.backlogLink.isDisplayed()).toBe(true);
    });

    it('should contain "Customize" link', function () {
      expect(self.customizeLink.isDisplayed()).toBe(true);
    });

    it('should contain "Settings" link', function () {
      expect(self.settingsLink.isDisplayed()).toBe(true);
    });

    it('should contain "Help" link', function () {
      expect(self.helpLink.isDisplayed()).toBe(true);
    });

    if(highlightedLink){
      it('should highlight the current area', function () {
        expect(highlightedLink.getAttribute('class')).toContain('active');
      });
    }
  }}
});

module.exports = SidebarPage;
