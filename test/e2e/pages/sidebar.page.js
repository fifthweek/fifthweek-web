'use strict';

var SidebarPage = function() {};

SidebarPage.prototype = Object.create({}, {
  sidebar: { get: function () { return element(by.id('sidebar')); }},
  links: { get: function () { return element.all(by.css('#sidebar ul a')); }},
  signInLink: { get: function () { return element(by.id('sidebar-navigation-sign-in')); }},
  registerLink: { get: function () { return element(by.id('sidebar-navigation-register')); }},
  createBlogLink: { get: function () { return element(by.id('sidebar-navigation-create-blog')); }},
  readNowLink: { get: function () { return element(by.id('sidebar-navigation-read-now')); }},
  landingPageLink: { get: function () { return element(by.id('sidebar-navigation-preview-blog')); }},
  postsLink: { get: function () { return element(by.id('sidebar-navigation-posts')); }},
  collectionsLink: { get: function () { return element(by.id('sidebar-navigation-collections')); }},
  channelsLink: { get: function () { return element(by.id('sidebar-navigation-channels')); }},
  subscribersLink: { get: function () { return element(by.id('sidebar-navigation-subscribers')); }},
  accountLink: { get: function () { return element(by.id('sidebar-navigation-account')); }},
  helpLink: { get: function () { return element(by.id('sidebar-navigation-help')); }},

  includeEstablishedCreatorTests: { value: function(highlightedLink) {
    var self = this;

    describe('sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(8);
      });

      it('should contain "Read Now" link', function () {
        expect(self.readNowLink.isDisplayed()).toBe(true);
      });

      it('should contain "Preview Blog" link', function () {
        expect(self.landingPageLink.isDisplayed()).toBe(true);
      });

      it('should contain "Posts" link', function () {
        expect(self.postsLink.isDisplayed()).toBe(true);
      });

      it('should contain "Collections" link', function () {
        expect(self.collectionsLink.isDisplayed()).toBe(true);
      });

      it('should contain "Channels" link', function () {
        expect(self.channelsLink.isDisplayed()).toBe(true);
      });

      it('should contain "Subscribers" link', function () {
        expect(self.subscribersLink.isDisplayed()).toBe(true);
      });

      it('should contain "Account" link', function () {
        expect(self.accountLink.isDisplayed()).toBe(true);
      });

      it('should contain "Help" link', function () {
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }},

  includeNewCreatorTests: { value: function(highlightedLink) {
    var self = this;

    describe('consumer sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(4);
      });

      it('should contain "Read Now" link', function () {
        expect(self.readNowLink.isDisplayed()).toBe(true);
      });

      it('should contain "Create Blog" link', function () {
        expect(self.createBlogLink.isDisplayed()).toBe(true);
      });

      it('should contain "Account" link', function () {
        expect(self.accountLink.isDisplayed()).toBe(true);
      });

      it('should contain "Help" link', function () {
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }},

  includeConsumerTests: { value: function(highlightedLink) {
    var self = this;

    describe('consumer sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(3);
      });

      it('should contain "Read Now" link', function () {
        expect(self.readNowLink.isDisplayed()).toBe(true);
      });

      it('should contain "Account" link', function () {
        expect(self.accountLink.isDisplayed()).toBe(true);
      });

      it('should contain "Help" link', function () {
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }}
});

module.exports = SidebarPage;
